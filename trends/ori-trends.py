import os
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

es = Elasticsearch(
    hosts=os.environ['ES_HOST'],
    url_prefix=os.environ.get('ES_PATH', ''),
    port=os.environ.get('ES_PORT', 9200),
    use_ssl=True if os.environ.get('ES_PORT') == '443' else False,
    ca_certs=certifi.where(),
)

print('Elasticsearch cluster:', es.info())

r = Redis(
    host=os.environ.get('REDIS_HOST', 'localhost'),
    port=os.environ.get('REDIS_PORT', '6379'),
)

# Test for redis connection and show databases
print('Redis databases:', r.info('keyspace'))


def clean_corpus(corpus):
    new_corpus = list()

    corpus = re.sub(r'\s+', ' ', corpus).replace('(', '').replace(')', '').replace('"', ' ')

    for word in corpus.split(' '):
        if len(word) < 5 or len(word) > 30:
            continue

        if word[0].isdigit():
            continue

        # strip_chars = '(){}[]<>\'\"`.,?!:;_-'
        word = unidecode(word)  # Convert smart quotes to normal
        word = word.strip(punctuation)
        word = word.strip(punctuation)
        word = word.lower()

        if len(word) < 5:
            continue

        # Skip initials like g.d.v
        if word[1] == '.' and word[3] == '.':
            continue

        if not word[0].isalpha():
            continue

        # Domains and extensions
        if word[-4] == '.' or word[-3] == '.':
            continue

        if not re.match(r"^[a-zA-Z0-9_\-'/.&\b]*$", word):
            continue

        new_corpus.append(word)

    return new_corpus


def es_search_month():
    print('Getting ES results per month')

    valid_fields = ['text']

    if not os.path.exists('maand-dumps'):
        os.mkdir('maand-dumps')

    today = datetime.today()

    # Change this value to adjust how many months back should be processed
    months = 8

    end_date = datetime(today.year, today.month - 1, 1)
    current_date = end_date

    while current_date > end_date - relativedelta(months=months):
        dump_file = open('maand-dumps/{}-{:02d}.dump'.format(current_date.year, current_date.month), 'w')

        last_date = current_date + relativedelta(months=1)
        last_date = datetime(last_date.year, last_date.month, 1) - relativedelta(days=1)

        query = {
            "query": {
                # "match_all": {}
                "range": {
                    "date_modified": {
                        "gte": current_date.strftime("%d/%m/%Y"),
                        "lte": last_date.strftime("%d/%m/%Y"),
                        "format": "dd/MM/yyyy"
                    }
                }
            }
        }

        hits = scan(es, index="ori_*", query=query)
        for hit in hits:
            for field, value in hit['_source'].items():
                if field not in valid_fields:
                    continue

                if isinstance(value, list):
                    value = " ".join(value)

                value = value.replace('\n', ' ').replace('\r', ' ')

                if len(value) > 400:
                    dump_file.write('%s %s\n' % (hit['_index'], ' '.join(clean_corpus(value))))

        dump_file.close()

        current_date = current_date - relativedelta(months=1)


def es_search_municipality():
    print('Getting ES results per municipality')

    valid_fields = ['text']

    exclude_indices = [
        'resolver',
        'usage_logs',
    ]

    indices = es.indices.get('ori_*')

    if not os.path.exists('gemeente-dumps'):
        os.mkdir('gemeente-dumps')

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

        dump_file = open('gemeente-dumps/{}.dump'.format(index), 'w')

        i = 0
        for hit in hits:
            for field, value in hit['_source'].items():
                if field not in valid_fields:
                    continue

                if isinstance(value, list):
                    value = " ".join(value)

                if len(value) > 400:
                    i += 1
                    dump_file.write(' '.join(clean_corpus(value)) + '\n')

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
    file_paths = sorted(glob(path))
    for file_path in file_paths:
        name = file_path.split('/')[1].split('.')[0]
        # itertools.chain(*[terms for _, terms in iter_file_lines(file_path)])
        yield name, list(chain(*[terms for _, terms in iter_file_lines(file_path)]))


def term_occurs(term, path, min_occurs):
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
    return (len([count for count in index_count.values() if count >= min_occurs]) * 1.00) / len(index_total)


def weighwords(path, amount=30):
    print('Processing parsimonious weighwords for %s' % path)

    files_terms = [data for _, data in files_combined_terms(path)]
    model = ParsimoniousLM(files_terms, w=.01)
    swlm = SignificantWordsLM(files_terms, lambdas=(.9, .01, .09))

    print()
    print()

    for name, terms in files_combined_terms(path):
        print("######  {}  ######".format(name))
        if not terms:
            print('<leeg>')
            continue

        top_terms = model.top(amount, terms)
        swlm_top = swlm.group_top(
            amount,
            grouper(terms, math.ceil(len(terms) / 10)),
            fix_lambdas=True,
        )

        # Minimum of occurrences in other lines in same corpora
        min_occurs = 1
        occur_threshold = 0.19

        print(f"{'=ParsimoniousLM (not used)':40} {'score':12} {'count':4}         {'=SignificantWordsLM':40} {'score':12} {'count'}")
        for (plm_t, plm_p), (swlm_t, swlm_p) in zip(top_terms, swlm_top):
            plm_c = term_occurs(plm_t, 'maand-dumps/%s.dump' % name, min_occurs)
            swlm_c = term_occurs(swlm_t, 'maand-dumps/%s.dump' % name, min_occurs)

            if swlm_c < occur_threshold:
                continue

            print(f"{plm_t:<40} {np.exp(plm_p):<12.4f} {plm_c:<4.2}          {swlm_t:<40} {swlm_p:<12.4f} {swlm_c:<4.2}")

        r.delete('raadstalk.%s' % name)
        for term, _ in swlm_top:
            if term_occurs(term, 'maand-dumps/%s.dump' % name, min_occurs) < occur_threshold:
                continue
            r.rpush('raadstalk.%s' % name, term)
        print()
        print()


# Main
if __name__ == '__main__':
    print('Start processing')

    ### Municipality data currently not needed
    ## es_search_municipality()
    ## weighwords('gemeente-dumps/*.dump')

    es_search_month()
    weighwords('maand-dumps/*.dump')

    print('Done processing')
