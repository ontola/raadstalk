from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
from collections import defaultdict
from weighwords import ParsimoniousLM
import numpy as np
import itertools
from glob import glob
from unidecode import unidecode
import re
from string import punctuation
from redis import Redis
import os
import certifi


es = Elasticsearch(
    hosts=os.environ['ES_HOST'],
    url_prefix=os.environ['ES_PATH'],
    port=os.environ['ES_PORT'],
    use_ssl=True if os.environ['ES_PORT'] == '443' else False,
    ca_certs=certifi.where(),
)

r = Redis(
    host=os.environ.get('REDIS_HOST', 'localhost'),
    port=os.environ.get('REDIS_PORT', '6379'),
)

# Test for redis connection and show databases
print 'Redis databases:', r.info('keyspace')


def clean_corpus(corpus):
    new_corpus = list()

    corpus = re.sub(r'\s+', ' ', corpus).replace('(', '').replace(')', '').replace('"', ' ')

    for word in corpus.split(' '):
        if len(word) < 5 or len(word) > 30:
            continue

        if word[0].isdigit():
            continue

        # strip_chars = '(){}[]<>\'\"`.,?!:;_-'
        word = unidecode(word.decode('utf-8'))  # Convert smart quotes to normal
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
    print 'Getting ES results per month'

    valid_fields = ['text']

    months = [
        (1, 2018),
        (2, 2018),
        (3, 2018),
        (4, 2018),
        (5, 2018),
        (6, 2018),
        (7, 2018),
        (8, 2018),
        (9, 2018),
        (10, 2018),
        (11, 2018),
        (1, 2019),
    ]

    if not os.path.exists('maand-dumps'):
        os.mkdir('maand-dumps')

    for month, year in months:
        dump_file = open('maand-dumps/{}-{:02d}.dump'.format(year, month), 'w')

        query = {
            "query": {
                # "match_all": {}
                "range": {
                    "date_modified": {
                        "gte": "01/{}/{}".format(month, year),
                        "lte": "01/{}/{}".format(month + 1, year),
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
                    dump_file.write(' '.join(clean_corpus(value.encode('utf-8'))) + '\n')

        dump_file.close()


def es_search_municipality():
    print 'Getting ES results per municipality'

    valid_fields = ['text']

    exclude_indices = [
        'ori_resolver',
        'ori_usage_logs',
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
                    dump_file.write(' '.join(clean_corpus(value.encode('utf-8'))) + '\n')

        dump_file.close()


def weighwords(amount=20):
    print 'Processing parsimonious weighwords algorithm'

    def iter_dump(file_path):
        with open(file_path, 'r') as f:
            all_lines = f.read()

            if not all_lines:
                return None

            return all_lines.replace('\n', ' ').split(' ')

    def read_files():
        file_paths = sorted(glob('*-dumps/*.dump'))
        for file_path in file_paths:
            date = file_path.split('/')[1].split('.')[0]
            dump_data = iter_dump(file_path)
            if dump_data:
                yield date, dump_data

    model = ParsimoniousLM([data for _, data in read_files()], w=.01)

    print
    print

    for name, terms in read_files():
        print("######  {}  ######".format(name))
        if not terms:
            print('<leeg>')
            continue

        top_terms = model.top(amount, terms)

        for term, p in top_terms:
            print("{:<40}{:.4f}".format(term, np.exp(p)))

        r.delete(name)
        r.rpush(name, *[term for term, _ in top_terms])
        print
        print


# Main
if __name__ == '__main__':
    print 'Start processing'
    es_search_month()
    es_search_municipality()
    weighwords()
    print 'Done processing'
