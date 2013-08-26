var DOMBuilder = require('DOMBuilder'),
  extend = require('node.extend'),
  CMSBlock = require('../models/CMSBlock').model(),
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

      CMSBlock.findOne({
        name: options.name
      }, function(error, cmsBlock) {
        if (error) throw error;
        if (cmsBlock) {
          html = cmsBlock.html;
        }
        // Authenticated attributes
        var attributes = options.attributes || {};
        if (context.ctx.user && context.ctx.user.hasPermission('manage-content')) {
          attributes = extend(attributes, {
            'id': 'cms-' + uuid.v4(),
            'class': 'cms-block',
            'data-original-html': html,
            'data-name': options.name,
            'data-csrf': context.ctx._csrf
          });
        }
        callback(null, DOMBuilder.build([
          'div', attributes, DOMBuilder.html.markSafe(html)
        ], 'html').toString());
      })
    })
  };
}

