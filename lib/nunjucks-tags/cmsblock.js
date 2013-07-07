var DOMBuilder = require('DOMBuilder'),
  extend = require('node.extend'),
  CMSBlock = require('../models/CMSBlock')
  uuid = require('node-uuid');

/**
* CMS Block nunjucks custom tag.
*/
module.exports = new function() {
  this.tags = ['cmsblock'];

  this.parse = function(parser, nodes, lexer) {
    var token = parser.nextToken();
    var args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    var body = parser.parseUntilBlocks('endcmsblock');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = function(context, options, body) {
    // Get updated content

    // Authenticated attributes
    var attributes = options.attributes || {};
    if (context.user && context.user.hasPermission('edit-content')) {
      attributes = extend(attributes, {
        'id': 'cms-' + uuid.v4(),
        'class': 'cms-block',
        'data-original-html': body()
      });
    }
    return DOMBuilder.build(['div', attributes, DOMBuilder.html.markSafe(body())], 'html').toString();
  };
}

