var DOMBuilder = require('DOMBuilder'),
  extend = require('node.extend'),
  CMSContent = require('../models/CMSContent').model(),
  CMSRequest = require('../models/CMSRequest').model(),
  uuid = require('node-uuid');

/**
 * CMS Block nunjucks custom tag.
 */
module.exports = new function() {
  this.tags = ['cmsblock'];

  this.parse = function(parser, nodes) {
    var tok = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        var body = parser.parseUntilBlocks('endcmsblock');
        parser.advanceAfterBlockEnd();

        return new nodes.CallExtensionAsync(this, 'run', args, [body]);
  };

  this.run = function(context, options, body, callback) {
    body(function(error, html) {
      if (error) throw error;

      (new CMSRequest({
        name: options.name,
        type: CMSRequest.types.BLOCK,
        requestedUri: context.ctx.uri
      }).save(function(error) {
        if (error) throw error;

        CMSContent.findOne({
          name: options.name
        }, function(error, cmsContent) {
          if (error) throw error;

          if (cmsContent) {
            html = cmsContent.html;
          }
          // Authenticated attributes
          var attributes = options.attributes || {};
          if (context.ctx.user && context.ctx.user.hasPermission('manage-content')) {
            attributes = extend(attributes, {
              'id': 'cms-' + uuid.v4(),
              'class': 'cms-block',
              'data-original-html': html,
              'data-name': options.name,
              'data-csrf': context.ctx._csrf,
              'data-type': CMSContent.types.BLOCK
            });
          }
          callback(null, DOMBuilder.build([
            'div', attributes, DOMBuilder.html.markSafe(html)
          ], 'html').toString());
        });
      }));
    });
  };
}

