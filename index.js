var CMSBlock = require('./lib/cmsblock'),
  CMSTag = require('./lib/cmstag');

var express = require('express'),
  nunjucks = require('nunjucks');

module.exports = {
  initialise: function(app) {
    var nunjucksEnvironment = app.get('nunjucksEnvironment');
    nunjucksEnvironment.addExtension('CMSBlock', CMSBlock);
    nunjucksEnvironment.addExtension('CMSTag', CMSTag);

    app.use('/cms', express.static(__dirname + '/public'));
  }
};
