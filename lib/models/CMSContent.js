var CMSContentSchema = null,
  CMSContent = null,
  CMSRevisionsSchema = null,
  CMSRevisions = null,
  CMSRevisionSchema = null,
  CMSRevision = null,
  timestamps = require('mongoose-times');

function initialiseSchema(mongoose, connection) {

  CMSRevisionSchema = new mongoose.Schema({
    html: String
  });
  CMSRevisionSchema.plugin(timestamps);
  CMSRevision = connection.model('CMSRevision', CMSRevisionSchema);

  CMSRevisionsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    revisions: [CMSRevisionSchema]
  });
  CMSRevisionsSchema.plugin(timestamps);

  var types = {
    BLOCK: 'Block',
    TAG: 'Tag',
    CONTENT: 'Content'
  };
  CMSRevisionsSchema.statics.types = types;
  CMSRevisions = connection.model('CMSRevisions', CMSRevisionsSchema);

  CMSContentSchema = new mongoose.Schema({
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
    updater: String
  });

  CMSContentSchema.plugin(timestamps);
  CMSContentSchema.statics.types = types;

  /**
   * Create a new CMSRevisions object and add the current HTML.
   *
   * @param {Function} next
   */
  CMSContentSchema.pre('save', function preSave(next) {
    (new CMSRevisions({
      name: this.name,
      revisions: [new CMSRevision({ html: this.html })]
    })).save(next);
  });

  /**
   * Update existing revisions object with current HTML.
   *
   * @param {Function} next
   */
  CMSContentSchema.pre('update', function preUpdate(next) {
    var self = this;
    CMSRevisions.findOne({ name: self.name }, function(error, revisions) {
      if (error) return next(error);
      revisions.revisions.push(new CMSRevision({
        html: self.html
      }));
      return revisions.save(next);
    });
  });

  CMSContent = connection.model('CMSContent', CMSContentSchema);
}

module.exports = {
  initialise: function(mongoose, connection) {
    initialiseSchema(mongoose, connection);
  },
  model: function() {
    return CMSContent;
  }
};
