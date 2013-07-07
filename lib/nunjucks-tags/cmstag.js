var DOMBuilder = require('DOMBuilder'),
  extend = require('node.extend'),
  uuid = require('node-uuid');

/**
* CMS Block nunjucks custom tag.
*/
module.exports = function() {
  this.tags = ['cmstag'];

  this.parse = function(parser, nodes, lexer) {
    var token = parser.nextToken();
    var args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    var body = parser.parseUntilBlocks('endcmstag');
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'run', args, [body]);
  };

  this.run = function(context, options, body) {
    // Get updated content

    // Authenticated attributes
    var attributes = options.attributes || { tag: 'div' };
    if (context.user && context.user.hasPermission('edit-content')) {
      var authenticatedAttributes = {
        'id': 'duffel-cms-' + uuid.v4(),
        'class': 'duffel-cms-tag',
        'data-original-html': body()
      };
      attributes = extend(attributes, authenticatedAttributes);
    }
    return DOMBuilder.build([options.tag, attributes, body()], 'html').toString();
  };
}

