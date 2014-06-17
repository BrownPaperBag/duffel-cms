var CMSRequestSchema = null,
  CMSRequest = null,
  timestamps = require('mongoose-times');

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
  CMSRequestSchema.plugin(timestamps);
  CMSRequest = connection.model('CMSRequest', CMSRequestSchema);
}

module.exports = {
  initialise: function(mongoose, connection) {
    initialiseSchema(mongoose, connection);
  },
  model: function() {
    return CMSRequest;
  }
};
