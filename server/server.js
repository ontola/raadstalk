const cors = require('cors');
const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');

const whitelist = ['http://localhost:8080', 'http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const app = express();

app.use(cors(corsOptions));
app.options(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'build')));

app.use('/search', proxy({
  target: 'https://api.openraadsinformatie.nl/v1/elastic',
  changeOrigin: true,
  logLevel: 'debug',
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);
