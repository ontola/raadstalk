# RaadsTalk
[![Build Status](https://semaphoreci.com/api/v1/projects/785f9851-b346-4ee3-b58c-5a4533498135/2531437/badge.svg)](https://semaphoreci.com/argu/raadstalk)

A webapplication that uses [Open Raadsinformatie](http://openraadsinformatie.nl) to show which topics are being discussed in Dutch municipalities.

## Run front-end

- `cd front`
- `yarn dev`

## Run server

- `cd server`
- `yarn dev`

## Run using docker

- Buid the docker image `docker build . -t raadstalk:latest`
- Run it `docker run -it -p 8080:8080 -e PORT=8080 raadstalk:latest`
- Visit `http://localhost:8080`

## Deployment

- Semaphore automatically builds after each new commit on master.
- SSH into the server `ssh root@83.96.241.31`.
- Make sure `~/dockerkey` contains a valid [gcloud access token](https://cloud.google.com/container-registry/docs/advanced-authentication#access_token).
- Run `~/recreate_raadstalk.sh`
