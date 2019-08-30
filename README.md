# RaadsTalk
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A webapplication that uses [Open Raadsinformatie](https://openraadsinformatie.nl) to show which topics are being discussed in Dutch municipalities. Uses the [WeighWords library](https://github.com/aolieman/weighwords/) / Parsimonius algorithm to calculate which words are trending.

Check it out at [VNG Realisatie](https://www.vngrealisatie.nl/producten/raadstalk) or at [raadstalk.nl](https://raadstalk.nl)!

## Use as widget

Add this iFrame to your webpage:

```
  <iframe src="https://raadstalk.nl/widget" height="100%" width="100%" frameborder="o" scrolling="no">
    Raadstalk kan niet worden geladen. Bezoek <a href="https://raadstalk.nl">raadstalk.nl</a>
  </iframe>
```

Put it inside a wrapping element that constrains its width (about 250px) and height (about 400px).

See [an example HTML file here](/example.html).

## Managing Topics

- Visit [`admin.localhost`](http://admin.localhost) (or [`admin.raadstalk.nl`](https://admin.raadstalk.nl) in production) and login using your credentials. The password is set with the `secret.env` file.
- Manage months and their items by adjusting `raadstalk.YYYY-MM`. You can remove items from the lists.
- Create backups by exporting the redis data and pasting the content to a new .redis file in the `./backups` folder. You can import these using the same interface.

## Local development

- Setup the environment variables `cd server && mv template.env .env`
- `./dev.sh`
- Visit `http://localhost`
- Redis admin is available at `http://localhost:8888` or `http://admin.localhost`
- If you have VSCode, you can use the `Debug server` configuration for the back-end

## Tasks

- `docker-compose up --build trends` for running trends task to update the words
- `docker-compose up --build countall` for updating trends task to update all counts
- `docker-compose up --build countlastmonth` for updating trends task to update last months counts

## Deployment & devops

- Clone the repo to the server.
- Clone the secret template file `cp secret_templace.env secret.env` and **change the password**.
- For HTTPS, use `./init-letsencrypt.sh`. Check [this tutorial](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71) for more information.
- `cd raadstalk`
- Download the latest version and restart docker-compose `./renew.sh`
- Don't forget to periodically run trends `crontab ./cronjob`

## Credits

Funded by VNG Realisatie B.V.

Development by Joep Meindertsma ([@joepio](https://github.com/joepio)) & Jurrian Trom ([@jurrian](https://github.com/jurrian)) from [Ontola](https://ontola.io) / [Argu](https://argu.co) B.V.
