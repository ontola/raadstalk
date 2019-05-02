# RaadsTalk

A webapplication that uses [Open Raadsinformatie](http://openraadsinformatie.nl) to show which topics are being discussed in Dutch municipalities.

## Run using docker-compose

- `docker-compose up --build web`
- Visit `http://localhost` for the app.
- Visit `http://admin.localhost` for managing the topics.
- `docker-compose up trends` for running trends task to update the words
- `docker-compose up countall` for updating trends task to update the counts

## Local development

- If you want to work locally on some specific service (e.g. the server), set the service scale parameter to 0: `docker-compose up --build --scale app=0`
- Setup the environment variables `mv template.env .env`
- Redis admin is available at `http://localhost:8888`

## Run front-end

- `cd front`
- `yarn`
- `yarn dev`

The front-end uses a simple express proxy server for local development (`setupProxy.js`).

## Run server

- `cd server`
- `yarn`
- `yarn dev`

## Run front-end + server using docker

- Buid the docker image `docker build . -t raadstalk:latest`
- Run it `docker run -it -p 8080:8080 -e PORT=8080 raadstalk:latest`
- Visit `http://localhost:8080`

## Deployment

[![Build Status](https://semaphoreci.com/api/v1/projects/785f9851-b346-4ee3-b58c-5a4533498135/2531437/badge.svg)](https://semaphoreci.com/argu/raadstalk)

- Semaphore automatically builds after each new commit on master.
- SSH into the server `ssh root@83.96.241.31`.
- Make sure `~/dockerkey` contains a valid [gcloud access token](https://cloud.google.com/container-registry/docs/advanced-authentication#access_token).
- Run `~/renew_raadstalk.sh`
