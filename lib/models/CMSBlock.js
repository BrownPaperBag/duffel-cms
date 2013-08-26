var CMSBlockSchema = null,
  CMSBlock = null;

function initialiseSchema(mongoose, connection) {
  CMSBlockSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    html: {
      type: String,
      required: true
    },
    updater: String
  });
  CMSBlock = connection.model('CMSBlock', CMSBlockSchema);
}

module.exports = {
  initialise: function(mongoose, connection) {
    initialiseSchema(mongoose, connection);
  },
  model: function() {
    return CMSBlock;
  }
}
