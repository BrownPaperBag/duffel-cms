var CMSBlock = require('duffel-cms').CMSBlock();

module.exports = function(parameters) {
  var app = parameters.app;

  app.protect.put('/cms/admin/content', 'manage-content', function(req, res){
    CMSBlock.findOne({ name: req.body.name }, function(error, cmsContent) {

      /**
       * Set 400 status and throw error if appropriate, else output success message.
       *
       * @param {Error} error
       */
      function completed(error) {
        if (error) {
          res.status(400);
          throw error;
        }
        res.json({
          message: 'Content saved successfully'
        });
      }
      var updatedFields = {
        name: req.body.name,
        html: req.body.html,
        type: req.body.type
      };
      if (!cmsContent) {
        cmsContent = new CMSBlock(updatedFields);
        return cmsContent.save(completed);
      }
      cmsContent.update(updatedFields, completed)
    });
  });
}

