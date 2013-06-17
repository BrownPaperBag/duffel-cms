var mongoose = require('mongoose');
var cmsBlockSchema = mongoose.schema({
  name: String,
  content: String
});

var CMSBlock = mongoose.model('CMSBlock', cmsBlockSchema);
