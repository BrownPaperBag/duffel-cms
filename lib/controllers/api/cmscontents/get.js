var CMSContent = require('duffel-cms').CMSContent();

module.exports = function(parameters) {
  var app = parameters.app;

  function getContentByUri() {

  }

  app.protect.get('/duffel-cms/api/cmscontents', 'view-cmscontents', function(req, res){

    var page = req.query.page,
      count = req.query.count,
      sorting = req.query.sorting || {},
      filter = req.query.filter || {};

    var order = [];
    Object.keys(sorting).forEach(function(key) {
      order.push(key + ' ' + (sorting[key] == 'asc' ? 'ASC' : 'DESC'));
    });

    var where = {};

    Object.keys(filter).forEach(function(key) {
      where[key] = {
        like: filter[key]
      };
    });

    var params = {
      where: where,
      order: order.join(', '),
    };

    if (page && count) {
      params.skip = (page - 1) * count;
      params.limit = count;
    }

    where.or = [
      {
        owner_type: null,
        owner_id: null
      }
    ];

    where.or.push({
      owner_id: req.query.owner_id,
      owner_type: req.query.owner_type
    });

    CMSContent.all(params, function(error, pages) {
      if (error) throw error;
      CMSContent.count(where, function(error, count) {
        if (error) throw error;
        res.json({
          total: count,
          result: pages
        });
      });
    });
  });

};
