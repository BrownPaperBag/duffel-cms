var CMSContent = null,
  CMSRevisions = null,
  CMSRevision = null;

function initialise(database) {

  var main = database.connections.main;

  CMSRevision = main.define('cms_revisions', {
    html: database.DataSource.Text,
    created: {
      type: Date,
      default: Date.now
    }
  });

  CMSRevisionSet = main.define('cms_revisions_set', {
    name: {
      type: String,
      required: true,
    },
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

  var types = {
    BLOCK: 'Block',
    TAG: 'Tag',
    CONTENT: 'Content'
  };
  CMSRevisionSet.types = types;

  CMSContent = main.define('cms_content', {
    name: {
      type: String,
      required: true,
      unique: true
    },
    type: String,
    html: {
      type: String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: Date,
    updater: Number
  });

  CMSContent.types = types;

  /**
   * Create a new CMSRevisions object and add the current HTML.
   *
   * @param {Function} next
   */
  CMSContent.beforeSave = function preSave(next) {
    (new CMSRevisions({
      name: this.name,
      revisions: [new CMSRevision({ html: this.html })]
    })).save(next);
  };

  /**
   * Update existing revisions object with current HTML.
   *
   * @param {Function} next
   */
  CMSContent.beforeUpdate = function preUpdate(next) {
    var self = this;
    CMSRevisions.findOne({ name: self.name }, function(error, revisions) {
      if (error) return next(error);
      revisions.revisions.push(new CMSRevision({
        html: self.html
      }));
      return revisions.save(next);
    });
  };

}

module.exports = {
  initialise: function(database) {
    initialise(database);
  },
  model: function() {
    return CMSContent;
  }
};
