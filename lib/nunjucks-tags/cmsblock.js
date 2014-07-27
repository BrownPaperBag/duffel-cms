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

      if (typeof options.owner_id == 'undefined') {
        options.owner_id = null;
      }

      if (typeof options.owner_type == 'undefined') {
        options.owner_type = null;
      }

      // Record the CMS content request
      (new CMSRequest({
        name: options.name,
        owner_id: options.owner_id,
        owner_type: options.owner_type,
        type: options.type || CMSRequest.types.BLOCK,
        uri: context.ctx.uri
      }).save(function(error, cmsRequest) {
        if (error) throw error;

        CMSContent.findOne({
          where: {
            name: options.name,
            owner_id: options.owner_id,
            owner_type: options.owner_type,
          }
        }, function(error, cmsContent) {
          if (error) throw error;

          if (!cmsContent) {
            // Save first revision of this content
            cmsContent = new CMSContent({
              name: options.name,
              owner_id: options.owner_id,
              owner_type: options.owner_type,
              type: options.type || CMSRequest.types.BLOCK,
              html: html
            });
            cmsContent.save(function(error) {
              if (error) throw error;
            });
          } else if (cmsContent.saved) {
            // IFF there is content and it has been intentionally saved, use it
            html = cmsContent.html;
          }

          function prepareAndCallback(options, attributes, html) {
            if (!options.contentOnly) {
              html = DOMBuilder.build([
                options.tag || 'div', attributes, DOMBuilder.html.markSafe(html)
              ], 'html').toString();
            }

            callback(null, html);
          }

          // Authenticated attributes
          var attributes = options.attributes || {};
          if (!context.ctx.user) {
            return prepareAndCallback(options, attributes, html);
          }

          context.ctx.user.hasPermission('manage-content').then(function(hasPermission) {
            attributes.class = (attributes.class || '') + ' cms-block';
            attributes = extend(attributes, {
              'id': 'cms-' + uuid.v4(),
              'data-original-html': html,
              'data-name': options.name,
              'data-csrf': context.ctx._csrf,
              'data-type': options.type || CMSRequest.types.BLOCK,
              'data-options': options.options
            });

            prepareAndCallback(options, attributes, html);
          });

        });
      }));
    });
  };
}

