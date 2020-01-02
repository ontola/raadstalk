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


def type_or_none(type, value):
    if not value:
        return None
    return type(value)


### CONFIGURATION ###

# Fields in Elasticsearch that should contain text for a doc
TEXT_FIELDS_ES = ['text']

# Elastic indices that should be queries
INDICES_ES = os.environ.get('INDICES_ES', 'ori_*')

# Minimum characters for a doc to be included in the corpus
DOC_CHARS_MIN = type_or_none(int, os.environ.get('DOC_CHARS_MIN', 400))

# Minimal amount of occurrences of a term within the municipality (doc) within
# the same corpus (month)
INDEX_TERM_OCCUR_MIN = type_or_none(int, os.environ.get('INDEX_TERM_OCCUR_MIN', 1))

# Minimal percentage occurrences of a term in other municipalities (docs)
# within the same corpus (month)
OCCURS_THRESHOLD = type_or_none(float, os.environ.get('OCCURS_THRESHOLD', 0.09))

# How many months of corpera should be used for the models
CORPUS_MONTHS = type_or_none(int, os.environ.get('CORPUS_MONTHS', 8))

# Removes the nth word form the terms list in order make the corpus smaller and
# reduce RAM. Setting to 2 will take half of the words. Should not be smaller than 2
REMOVE_NTH_FROM_TERMS = type_or_none(int, os.environ.get('REMOVE_NTH_FROM_TERMS', 2))

# How far ago should be fetched from elastic
START_YEAR = type_or_none(int, os.environ.get('START_YEAR'))
START_MONTH = type_or_none(int, os.environ.get('START_MONTH'))

# Minimum and maximum word lenghts when cleaning doc
WORD_CHARS_MIN = type_or_none(int, os.environ.get('WORD_CHARS_MIN', 5))
WORD_CHARS_MAX = type_or_none(int, os.environ.get('WORD_CHARS_MAX', 30))

# Number of results the model should return before
MODEL_RESULT_AMOUNT = type_or_none(int, os.environ.get('MODEL_RESULT_AMOUNT', 30))

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

if START_YEAR is not None and START_MONTH is not None:
    print('Settings START_MONTH: {}  START_YEAR: {}  CORPUS_MONTHS: {}'.format(START_MONTH, START_YEAR, CORPUS_MONTHS))
else:
    print('No START_MONTH and START_YEAR set, processing last month only. CORPUS_MONTHS: {}'.format(CORPUS_MONTHS))


def recreate_dir(path):
    if os.path.isdir(path):
        return

    try:
        shutil.rmtree(path, ignore_errors=True)
    except OSError:
        pass

    os.makedirs(path)


stupid_words = r.lrange("raadstalk.stupid_words", 0, -1)

spaces_regex = re.compile(r'[\s"]+')
valid_word_regex = re.compile(r"^[a-zA-Z0-9_\-'/.&\b]*$")


def clean_doc(doc):
    new_doc = list()

    doc = spaces_regex.sub(' ', doc).replace('(', '').replace(')', '')

    for word in doc.split(' '):
        word_length = len(word)
        if word_length < WORD_CHARS_MIN or word_length > WORD_CHARS_MAX:
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

        if word in stupid_words:
            continue

        if not valid_word_regex.match(word):
            continue

        new_doc.append(word)

    return new_doc


def es_search_month(path):
    print('Getting ES results per month')

    recreate_dir(path)

    today = datetime.today()

    # Start with last month
    current_date = datetime(today.year, today.month, 1) - relativedelta(months=1)
    if START_YEAR is not None and START_MONTH is not None:
        start_date = datetime(START_YEAR, START_MONTH + 1, 1)
    else:
        start_date = datetime(today.year, today.month, 1) - relativedelta(months=2)

    while current_date > start_date:
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

        print('Fetching items for {}'.format(current_date))
        hits = scan(es, index=INDICES_ES, query=query, scroll='20m')
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

        hits = scan(es, index=index, query=query, scroll='20m')

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
    file_paths = sorted(glob(os.path.join(path, '*')), reverse=True)[:CORPUS_MONTHS]
    for file_path in file_paths:
        name = os.path.splitext(os.path.basename(file_path))[0]

        terms = list(chain(*[terms for _, terms in iter_file_lines(file_path)]))

        # Delete the nth terms from the list to reduce RAM
        if REMOVE_NTH_FROM_TERMS > 1:
            del terms[REMOVE_NTH_FROM_TERMS-1::REMOVE_NTH_FROM_TERMS]

        yield name, terms


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

    if START_YEAR and START_MONTH:
        start_year = START_YEAR
        start_month = START_MONTH + 1
    else:
        today = datetime.today()
        previous_month = datetime(today.year, today.month, 1) - relativedelta(months=1)
        start_year = previous_month.year
        start_month = previous_month.month

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

        print()
        print()

        year = int(name[0:4])
        month = int(name[5:7])

        if year < start_year:
            continue

        if year == start_year and month < start_month:
            continue

        print('Saving to redis: raadstalk.%s' % name)
        print()

        r.delete('raadstalk.%s' % name)
        for term, _ in swlm_top:
            if term_occurs(term, '%s/%s.dump' % (path, name)) < OCCURS_THRESHOLD:
                continue
            r.rpush('raadstalk.%s' % name, term)


# Main
if __name__ == '__main__':
    ### Municipality data currently not needed
    ## es_search_municipality('es_dumps/municipality-dumps')
    ## weighwords('es_dumps/municipality-dumps')

    path = 'es_dumps/maand_dumps'
    es_search_month(path)
    weighwords(path)

    print('Done processing')
