import os
import shutil
import re
from datetime import datetime
from glob import glob
from string import punctuation
from itertools import zip_longest, chain
import math

import certifi
import numpy as np
from dateutil.relativedelta import relativedelta
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from redis import Redis
from unidecode import unidecode
from weighwords import ParsimoniousLM, SignificantWordsLM


### CONFIGURATION ###

# Fields in Elasticsearch that should contain text for a doc
TEXT_FIELDS_ES = ['text']

# Elastic indices that should be queries
INDICES_ES = os.environ.get('INDICES_ES', 'ori_*')

# Minimum characters for a doc to be included in the corpus
DOC_CHARS_MIN = os.environ.get('DOC_CHARS_MIN', 400)

# Minimal amount of occurrences of a term within the municipality (doc) within
# the same corpus (month)
INDEX_TERM_OCCUR_MIN = os.environ.get('INDEX_TERM_OCCUR_MIN', 1)

# Minimal percentage occurrences of a term in other municipalities (docs)
# within the same corpus (month)
OCCURS_THRESHOLD = os.environ.get('OCCURS_THRESHOLD', 0.09)

# How many months of corpera should be extracted from elastic
CORPUS_MONTHS = os.environ.get('CORPUS_MONTHS', 8)

# Minimum and maximum word lenghts when cleaning doc
WORD_CHARS_MIN = os.environ.get('WORD_CHARS_MIN', 5)
WORD_CHARS_MAX = os.environ.get('WORD_CHARS_MAX', 30)

# Number of results the model should return before
MODEL_RESULT_AMOUNT = os.environ.get('MODEL_RESULT_AMOUNT', 30)

# Model specific settings, see their documentation
PLM_W = .01
SWLM_LAMBDAS = (.9, .01, .09)

# Elasticsearch settings
ES_HOST = os.environ['ES_HOST']
ES_PATH = os.environ.get('ES_PATH', '')
ES_PORT = os.environ.get('ES_PORT', 9200)

# Redis settings
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = os.environ.get('REDIS_PORT', '6379')


es = Elasticsearch(
    hosts=ES_HOST,
    url_prefix=ES_PATH,
    port=ES_PORT,
    use_ssl=True if ES_PORT == '443' else False,
    ca_certs=certifi.where(),
)

print('Elasticsearch cluster:', es.info())

r = Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
    charset="utf-8",
)

# Test for redis connection and show databases
print('Redis databases:', r.info('keyspace'))


def recreate_dir(path):
    try:
        shutil.rmtree(path, ignore_errors=True)
    except OSError:
        pass

    os.mkdir(path)


def clean_doc(doc):
    new_doc = list()

    doc = re.sub(r'\s+', ' ', doc).replace('(', '').replace(')', '').replace('"', ' ')

    for word in doc.split(' '):
        if len(word) < WORD_CHARS_MIN or len(word) > WORD_CHARS_MAX:
            continue

        if word[0].isdigit():
            continue

        # strip_chars = '(){}[]<>\'\"`.,?!:;_-'
        word = unidecode(word)  # Convert smart quotes to normal
        word = word.strip(punctuation)
        word = word.strip(punctuation)
        word = word.lower()

        if len(word) < WORD_CHARS_MIN:
            continue

        # Skip initials like g.d.v
        if word[1] == '.' and word[3] == '.':
            continue

        if not word[0].isalpha():
            continue

        # Domains and extensions
        if word[-4] == '.' or word[-3] == '.':
            continue

        if word in r.lrange("raadstalk.stupid_words", 0, -1):
            continue

        if not re.match(r"^[a-zA-Z0-9_\-'/.&\b]*$", word):
            continue

        new_doc.append(word)

    return new_doc


def es_search_month(path):
    print('Getting ES results per month')

    recreate_dir(path)

    today = datetime.today()
    end_date = datetime(today.year, today.month - 1, 1)
    current_date = end_date

    while current_date > end_date - relativedelta(months=CORPUS_MONTHS):
        dump_file = open('{}/{}-{:02d}.dump'.format(path, current_date.year, current_date.month), 'w')

        last_date = current_date + relativedelta(months=1)
        last_date = datetime(last_date.year, last_date.month, 1) - relativedelta(days=1)

        query = {
            "query": {
                # "match_all": {}
                "range": {
                    "last_discussed_at": {
                        "gte": current_date.strftime("%d/%m/%Y"),
                        "lte": last_date.strftime("%d/%m/%Y"),
                        "format": "dd/MM/yyyy"
                    }
                }
            }
        }

        hits = scan(es, index=INDICES_ES, query=query)
        for hit in hits:
            for field, value in hit['_source'].items():
                if field not in TEXT_FIELDS_ES:
                    continue

                if isinstance(value, list):
                    value = " ".join(value)

                value = value.replace('\n', ' ').replace('\r', ' ')

                if len(value) > DOC_CHARS_MIN:
                    dump_file.write('%s %s\n' % (hit['_index'], ' '.join(clean_doc(value))))

        dump_file.close()

        current_date = current_date - relativedelta(months=1)


def es_search_municipality(path):
    print('Getting ES results per municipality')

    recreate_dir(path)

    exclude_indices = [
        'resolver',
        'usage_logs',
    ]

    indices = es.indices.get(INDICES_ES)

    for index in indices:
        if index in exclude_indices:
            continue

        query = {
            "query": {
                "match_all": {}
            }
        }

        hits = scan(es, index=index, query=query)

        if not hits:
            continue

        dump_file = open('{}/{}.dump'.format(path, index), 'w')

        i = 0
        for hit in hits:
            for field, value in hit['_source'].items():
                if field not in TEXT_FIELDS_ES:
                    continue

                if isinstance(value, list):
                    value = " ".join(value)

                if len(value) > DOC_CHARS_MIN:
                    i += 1
                    dump_file.write(' '.join(clean_doc(value)) + '\n')

        dump_file.close()


def grouper(iterable, n, filler=None):
    """Source: https://docs.python.org/3/library/itertools.html#itertools-recipes"""
    args = [iter(iterable)] * n
    return zip_longest(*args, fillvalue=filler)


def iter_file_lines(file_path):
    with open(file_path, 'r') as f:
        for line in f.readlines():
            if not line:
                continue
            terms = line.split(' ')
            yield terms[0], terms[1:]


def files_combined_terms(path):
    file_paths = sorted(glob(os.path.join(path, '*')))
    for file_path in file_paths:
        name = file_path.split('/')[1].split('.')[0]
        # itertools.chain(*[terms for _, terms in iter_file_lines(file_path)])
        yield name, list(chain(*[terms for _, terms in iter_file_lines(file_path)]))


def term_occurs(term, path):
    files_terms = [(index, data) for index, data in iter_file_lines(path)]
    index_count = dict()
    index_total = set()
    for index, terms in files_terms:
        index_total.add(index)
        if term in ' '.join(terms):
            try:
                index_count[index] += 1
            except KeyError:
                index_count[index] = 1
    return (len([count for count in index_count.values() if count >= INDEX_TERM_OCCUR_MIN]) * 1.00) / len(index_total)


def weighwords(path):
    print('Processing parsimonious weighwords for %s' % path)

    files_terms = [data for _, data in files_combined_terms(path)]
    plm = ParsimoniousLM(files_terms, w=PLM_W)
    swlm = SignificantWordsLM(files_terms, SWLM_LAMBDAS)

    print()
    print()

    for name, terms in files_combined_terms(path):
        print("######  {}  ######".format(name))
        if not terms:
            print('<leeg>')
            continue

        top_terms = plm.top(MODEL_RESULT_AMOUNT, terms)
        swlm_top = swlm.group_top(
            MODEL_RESULT_AMOUNT,
            grouper(terms, math.ceil(len(terms) / 10)),
            fix_lambdas=True,
        )

        print(f"{'=ParsimoniousLM (not used)':40} {'score':12} {'count':4}         {'=SignificantWordsLM':40} {'score':12} {'count'}")
        for (plm_t, plm_p), (swlm_t, swlm_p) in zip(top_terms, swlm_top):
            plm_c = term_occurs(plm_t, '%s/%s.dump' % (path, name))
            swlm_c = term_occurs(swlm_t, '%s/%s.dump' % (path, name))

            if swlm_c < OCCURS_THRESHOLD:
                continue

            print(f"{plm_t:<40} {np.exp(plm_p):<12.4f} {plm_c:<4.2}          {swlm_t:<40} {swlm_p:<12.4f} {swlm_c:<4.2}")

        r.delete('raadstalk.%s' % name)
        for term, _ in swlm_top:
            if term_occurs(term, '%s/%s.dump' % (path, name)) < OCCURS_THRESHOLD:
                continue
            r.rpush('raadstalk.%s' % name, term)
        print()
        print()


# Main
if __name__ == '__main__':
    print('Start processing')

    ### Municipality data currently not needed
    ## es_search_municipality('municipality-dumps')
    ## weighwords('municipality-dumps')

    path = 'maand-dumps'
    es_search_month(path)
    weighwords(path)

    print('Done processing')
