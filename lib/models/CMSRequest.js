var CMSRequestSchema = null,
  CMSRequest = null;

function initialiseSchema(mongoose, connection) {
  CMSRequestSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    type: String,
    requested: {
      type: Date,
      default: Date.now
    },
    requestedUri: String
  });
  CMSRequestSchema.statics.types = {
    BLOCK: 'Block',
    TAG: 'Tag',
    CONTENT: 'Content'
  };
  CMSRequest = connection.model('CMSBlockSchema', CMSRequestSchema);
}

module.exports = {
  initialise: function(mongoose, connection) {
    initialiseSchema(mongoose, connection);
  },
  model: function() {
    return CMSRequest;
  }
}
