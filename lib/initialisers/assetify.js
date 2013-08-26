var path = require('path');

module.exports = function(app, rootDirectory) {
  var assetify = app.get('assetify');
  if (!assetify) {
    return;
  }
  assetify.addFiles({
    css: [
      {
        file: path.join(rootDirectory, '/public/stylesheets/raptor.css'),
        profile: 'logged-in-cms'
      }
    ],
    js: [
      {
        file: path.join(rootDirectory, '/public/javascript/raptor.js'),
        profile: 'logged-in-cms'
      },
      {
        file: path.join(__dirname, '/../../public/javascript/raptor-initialisation.js'),
        profile: 'logged-in-cms'
      }
    ]
  });
};
