var path = require('path');

module.exports = function(app) {
  var assetManager = app.get('assetManager');

  assetManager.addFiles({
    profile: 'duffel-cms-cmscontent',
    permission: 'manage-content',
    after: [
      'angular-resource',
    ],
    js: [
      path.join(__dirname, '/../../public/javascript/resources/cms-content.js')
    ]
  });

};
