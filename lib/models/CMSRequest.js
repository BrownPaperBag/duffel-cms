var CMSRequest = null;

function initialiseSchema(database) {
  CMSRequest = database.connections.main.define('cms_requests', {
    uri: {
      type: String,
      required: true,
    },
    requested: {
      type: Date,
      default: Date.now
    },
  });
}

module.exports = {
  initialise: function(database) {
    initialiseSchema(database);
  },
  model: function() {
    return CMSRequest;
  }
};
