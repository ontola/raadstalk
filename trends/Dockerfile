FROM python:2.7-alpine3.9
WORKDIR /opt/trends/
COPY requirements.txt requirements.txt
RUN apk --no-cache add musl-dev g++ \
  && pip install --no-cache-dir -r requirements.txt \
  && apk del musl-dev g++
COPY ori-trends.py ori-trends.py
CMD python ori-trends.py
ENV ES_HOST='api.openraadsinformatie.nl' \
    ES_PORT=443 \
    ES_PATH='/v1/elastic' \
    REDIS_HOST='redis' \
    REDIS_PORT=6379
