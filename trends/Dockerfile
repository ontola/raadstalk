FROM python:3.7-alpine3.9
ENV PYTHONUNBUFFERED 1
WORKDIR /opt/trends/
COPY requirements.txt requirements.txt
RUN apk --no-cache add musl-dev git g++ \
  && pip install --no-cache-dir -r requirements.txt \
  && apk del musl-dev git g++
COPY ori-trends.py ori-trends.py
CMD python ori-trends.py
ENV ES_HOST='34.90.191.24' \
    ES_PORT=9200 \
    ES_PATH= \
    REDIS_HOST='redis' \
    REDIS_PORT=6379
