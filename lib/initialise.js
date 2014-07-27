var controllerLoader = require('controller-loader'),
  path = require('path');

module.exports = function(app, database, callback) {
  require('../lib/initialisers/assets')(app);

  require('../lib/models/CMSRequest').initialise(database);
  require('../lib/models/CMSContent').initialise(database, require('../lib/models/CMSRequest').model());

  app.before('router').use(function applicationLocals(req, res, next) {
    res.locals.uri = req.originalUrl;
    next();
  }).as('cmsLocalUri');

  app.get('nunjucksEnvironment')
    .addExtension('CMSBlock', require('../lib/nunjucks-tags/cmsblock'));

  controllerLoader.load(path.resolve(path.join(__dirname, 'controllers')), function(controller) {
    require(controller)({
      app: app
    });
  }, callback);
};
