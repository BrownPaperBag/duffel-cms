module.exports = {
  initialise: require('./lib/initialise'),
  CMSBlock: function() {
    return require('./lib/models/CMSContent').model();
  },
  CMSRequest: function() {
    return require('./lib/models/CMSRequest').model();
  }
};
