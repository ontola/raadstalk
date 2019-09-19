# Trends

This application is responsible for reading documents from the ElasticSearch service,
finding the significant terms and pushing these to a running Redis instance.

## Usage

Using docker:

```
docker-compose up trends
```

## Configuration

The configuration is defined in the top of `ori-trends.py`. Most settings can be
changed by setting the environment.