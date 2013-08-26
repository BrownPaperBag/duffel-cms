module.exports = function(parameters) {
  var app = parameters.app;

  app.protect.post('/cms/admin/content', 'manage-content', function(req, res){
    req.json({

    })
  });
}

