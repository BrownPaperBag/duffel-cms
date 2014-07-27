var CMSRequest = null;

function initialiseSchema(database) {
  CMSRequest = database.connections.main.define('cms_requests', {
    name: {
      type: String,
      required: true,
    },
    type: String,
    requested: {
      type: Date,
      default: Date.now
    },
    uri: String
  });

  CMSRequest.types = {
    BLOCK: 'Block',
    TAG: 'Tag',
    CONTENT: 'Content'
  };
}

module.exports = {
  initialise: function(database) {
    initialiseSchema(database);
  },
  model: function() {
    return CMSRequest;
  }
};
