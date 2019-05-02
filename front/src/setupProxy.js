const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/popular', { target: 'http://localhost:8080/' }));
  app.use(proxy('/search', { target: 'http://localhost:8080/' }));
};
