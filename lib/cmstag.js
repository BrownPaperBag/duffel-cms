var DOMBuilder = require('DOMBuilder'),
  extend = require('node.extend'),
  uuid = require('node-uuid');

/**
* CMS Block nunjucks custom tag.
*/
function CMSTag() {
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
    var authenticatedAttributes = {};
    if (true) {
      authenticatedAttributes = {
        'id': 'duffel-cms-' + uuid.v4(),
        'class': 'duffel-cms-tag',
        'data-original-html': body()
      };
    }
    var attributes = extend(options.attributes, authenticatedAttributes);
    return DOMBuilder.build([options.tag, attributes, body()], 'html').toString();
  };
}

module.exports = new CMSTag();

