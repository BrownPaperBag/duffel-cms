var express = require('express'),
  controllerLoader = require('controller-loader'),
  nunjucks = require('nunjucks');

module.exports = function(app, mongoose, connection, rootDirectory) {
  require('../lib/initialisers/assetify')(app, rootDirectory);

  require('../lib/models/CMSContent').initialise(mongoose, connection);
  require('../lib/models/CMSRequest').initialise(mongoose, connection);

  controllerLoader.load(path.resolve(path.join(__dirname, '../lib/controllers')), function(controller) {
    require(controller)({
      app: app
    });
  });

  app.before('router').use(function applicationLocals(req, res, next) {
    res.locals.uri = req.originalUrl;
    next();
  }).as('cmsLocalUri');

  var nunjucksEnvironment = app.get('nunjucksEnvironment');
  nunjucksEnvironment.addExtension('CMSBlock', require('../lib/nunjucks-tags/cmsblock'));

  app.use('/cms', express.static(__dirname + '/public'));
};
