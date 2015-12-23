'use strict';

/* This code has come from https://github.com/segmentio/xml-parser with a minor update so that it can handle element names with hyphens such as "entity-Person"
 * The JSON created by the parser always has root as the start of the document.
 * All elements have name (String), attributes (Object), children (Array) and content (String) properties.
 */
 
module.exports = parse;

function parse(xml) {
  xml = xml.trim().replace(/<!--[\s\S]*?-->/g, ''); //Remove comments
  return {
    declaration: declaration(),
    root: tag()
  };

  function declaration() {
    var m = match(/^<\?xml\s*/);
    if (!m) return;

    var node = { attributes: {} }; //tag

    // attributes
    while (!(eos() || is('?>'))) {
      var attr = attribute();
      if (!attr) return node;
      node.attributes[attr.name] = attr.value;
    }

    match(/\?>\s*/);

    return node;
  }

  function tag() {
    var m = match(/^<([\w\-:.]+)\s*/);
    if (!m) return;

    // name
    var node = {
      name: m[1],
      attributes: {},
      children: []
    };

    // attributes
    while (!(eos() || is('>') || is('?>') || is('/>'))) {
      var attr = attribute();
      if (!attr) return node;
      node.attributes[attr.name] = attr.value;
    }

    // self closing tag
    if (match(/^\s*\/>\s*/)) {
      return node;
    }

    match(/\??>\s*/);

    // content
    node.content = content();

    // children
    var child;
    while (child = tag()) {
      node.children.push(child);
    }

    // closing
    match(/^<\/[\w\-:.]+>\s*/);

    return node;
  }

  function content() {
    var m = match(/^([^<]*)/);
    if (m) return m[1];
    return '';
  }

  function attribute() {
    var m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
    if (!m) return;
    return { name: m[1], value: strip(m[2]) };
  }

  //Strip quotes
  function strip(val) {
    return val.replace(/^['"]|['"]$/g, '');
  }

  //Match and advance the string
  function match(re) {
    var m = xml.match(re);
    if (!m) return;
    xml = xml.slice(m[0].length);
    return m;
  }

  //End of source
  function eos() {
    return 0 === xml.length;
  }

  //Check for prefix
  function is(prefix) {
    return 0 === xml.indexOf(prefix);
  }
}
