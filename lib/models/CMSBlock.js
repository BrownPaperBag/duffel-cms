var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var cmsBlockSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  updater: String
});

module.exports = mongoose.model('CMSBlock', cmsBlockSchema);
