# RaadsTalk

A webapplication that uses [Open Raadsinformatie](http://openraadsinformatie.nl) to show which topics are being discussed in Dutch municipalities.

Check it out at [VNG Realisatie](https://www.vngrealisatie.nl/producten/raadstalk) or at [raadstalk.nl](http://raadstalk.nl)!

## Use as widget

Add this iFrame to your webpage:

```
  <iframe src="http://raadstalk.nl/widget" height="100%" width="100%" frameborder="o" scrolling="no">
    Raadstalk kan niet worden geladen. Bezoek <a href="http://raadstalk.nl">raadstalk.nl</a>
  </iframe>
```

Put it inside a wrapping element that constrains its width (about 250px) and height (about 400px).

See [an example HTML file here](/example.html).

## Managing Topics

- Visit `http://admin.raadstalk` and login using your credentials.
- Manage months and their items by adjusting `raadstalk.YYYY-MM`. You can remove items from the lists.
- Create backups by exporting the redis data.
- If something goes wrong, you can import the `.redisbackup` from this repository.

## Run using docker-compose

- `docker-compose up --build nginx`
- Visit `http://localhost` for the app.
- Visit `http://admin.localhost` for managing the topics. Log in using `admin` and `oritrends`
- `docker-compose up --build trends` for running trends task to update the words
- `docker-compose up --build countall` for updating trends task to update all counts
- `docker-compose up --build countlastmonth` for updating trends task to update last months counts

## Local development

- `./dev.sh`
- Setup the environment variables `cd server && mv template.env .env`
- Redis admin is available at `http://localhost:8888`
- If you have VSCode, you can use the `Debug server` configuration

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

## Deployment & devops

[![Build Status](https://semaphoreci.com/api/v1/projects/785f9851-b346-4ee3-b58c-5a4533498135/2531437/badge.svg)](https://semaphoreci.com/argu/raadstalk)

- For HTTPS, use `./init-letsencrypt.sh`. You might need to run a seperate NGINX instance. Check [this tutorial](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71). Make sure
- Semaphore automatically builds after each new commit on master.
- SSH into the server `ssh root@raadstalk.nl`.
- `cd raadstalk`
- Download the latest version and restart docker-compose `./renew.sh`
- Don't forget to periodically run trends `crontab ./cronjob`
- Set your start and end date

## Credits

Funded by VNG Realisatie B.V.
Development by Joep Meindertsma (@joepio) & Jurrian Trom (@jurrian) from Ontola / Argu B.V.
