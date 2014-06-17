var express = require('express'),
  controllerLoader = require('controller-loader'),
  path = require('path');

module.exports = function(app, mongoose, connection, callback) {

  require('../lib/models/CMSContent').initialise(mongoose, connection);
  require('../lib/models/CMSRequest').initialise(mongoose, connection);

  app.before('router').use(function applicationLocals(req, res, next) {
    res.locals.uri = req.originalUrl;
    next();
  }).as('cmsLocalUri');

  app.get('nunjucksEnvironment')
    .addExtension('CMSBlock', require('../lib/nunjucks-tags/cmsblock'));

  callback(null, app);
};
