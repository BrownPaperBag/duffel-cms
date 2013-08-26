var express = require('express'),
  controllerLoader = require('controller-loader'),
  nunjucks = require('nunjucks');

module.exports = function(app, mongoose, connection, rootDirectory) {
  require('../lib/initialisers/assetify')(app, rootDirectory);
  require('../lib/models/CMSBlock').initialise(mongoose, connection);

  controllerLoader.load(path.resolve(path.join(__dirname, '../lib/controllers')), function(controller) {
    require(controller)({
      app: app
    });
  });

  var cmsblock = require('../lib/nunjucks-tags/cmsblock'),
  cmstag = require('../lib/nunjucks-tags/cmstag');

  var nunjucksEnvironment = app.get('nunjucksEnvironment');
  nunjucksEnvironment.addExtension('CMSBlock', cmsblock);
  nunjucksEnvironment.addExtension('CMSTag', cmstag);

  app.use('/cms', express.static(__dirname + '/public'));
};
