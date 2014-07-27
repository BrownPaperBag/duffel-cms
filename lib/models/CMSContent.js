var CMSContent = null,
  CMSRevisions = null,
  CMSRevision = null;

function initialise(database, CMSRequest) {

  var main = database.connections.main;

  CMSRevision = main.define('cms_revisions', {
    html: database.DataSource.Text,
    created: {
      type: Date,
      default: Date.now
    }
  });

  CMSRevisionSet = main.define('cms_revisions_set', {
    created: {
      type: Date,
      default: Date.now
    },
    updated: Date,
  });

  CMSRevisionSet.hasMany(CMSRevision, {
    as: 'cms_revisions',
    foreignKey: 'cms_revisions_set_id'
  });

  CMSContent = main.define('cms_content', {
    name: {
      type: String,
      required: true,
      unique: true
    },
    type: String,
    html: database.DataSource.Text,
    saved: {
      type: Boolean,
      default: false,
      comment: 'Whether this content has been saved by the user'
    },
    owner_id: Number,
    owner_type: String,
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
    },
    updater: Number
  });

  CMSContent.hasOne(CMSRevisionSet, {
    as: 'cms_revisions',
    foreignKey: 'cms_content_id'
  });
  CMSRevisionSet.belongsTo(CMSContent, {
    as: 'cms_content',
    foreignKey: 'cms_content_id'
  });

  CMSContent.hasMany(CMSRequest, {
    as: 'cms_requests',
    foreignKey: 'cms_content_id'
  });

  CMSRequest.belongsTo(CMSContent, {
    as: 'cms_content',
    foreignKey: 'cms_content_id'
  });

  CMSContent.types = types;

  /**
   * Create a new CMSRevisions object and add the current HTML.
   *
   * @param {Function} next
   */
  CMSContent.beforeSave = function preSave(next) {
    this.updated = new Date();

    var cmsRevisionSet = new CMSRevisionSet({
      name: this.name,
    });

    cmsRevisionSet.save(function(error, cmsRevisionSet) {
      cmsRevisionSet.cms_revisions.create({
        html: this.html
      });

      cmsRevisionSet.save(next());
    });
  };

  /**
   * Update existing revisions object with current HTML.
   *
   * @param {Function} next
   */
  CMSContent.beforeUpdate = function preUpdate(next) {
    var self = this;
    CMSRevisionSet.findOne({ name: self.name }, function(error, revisions) {
      if (error) return next(error);
      revisions.cms_revisions.create({
        html: self.html
      });
      revisions.save(next);
    });
  };

  CMSRevisionSet.beforeSave = function(next) {
    this.updated = new Date();
    next();
  };

}

module.exports = {
  initialise: function(database, CMSRequest) {
    initialise(database, CMSRequest);
  },
  model: function() {
    return CMSContent;
  }
};
