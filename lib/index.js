'use strict';

var parse = require('./parse');
var _ = require('lodash');
var entities = require("entities");
var ANY = '*';
var DEFAULT_OPTIONS = { removeNamespacePrefixes: true };

module.exports = {
	parse: parseWithOptions,
	getChildNodes: getChildNodes,
	getChildNode: getChildNode,
	getContent: getContent,
  getRawContent: getRawContent,
	getAllContent: getAllContent,
	removeNamespacePrefixes: removeNamespacePrefixes,
	decodeXML: decodeXML,
	encodeXML: encodeXML,
	ANY: ANY
};

function parseWithOptions(xml, options) {
  var opts = _.merge({}, DEFAULT_OPTIONS, options);
  if (opts.removeNamespacePrefixes) {
    return parse(removeNamespacePrefixes(xml));
  }
  return parse(xml);
}

function getChildNodes(node, name) {
	if (!node) { return []; }
	var names = (name instanceof Array) ? name : [name];
	var children = (names[0] === ANY) ? node.children : _.filter(node.children, {name: names[0]});
	return (names.length > 1) ? concatChildNodes(children, names.slice(1)) : children;
}

function concatChildNodes(children, names) {
	var nodes = [];
	_.forEach(children, function(child) {
		nodes = nodes.concat(getChildNodes(child, names));
	});
	return nodes;
}

function getChildNode(node, name) {
	var nodes = getChildNodes(node, name);
	return (nodes.length > 0) ? nodes[0] : null;
}

function getContent(node, names) {
	var contents = getAllContent(node, names);
	return (contents.length > 0) ? decodeXML(contents[0]) : null;
}

function getRawContent(node, names) {
	var contents = getAllContent(node, names);
	return (contents.length > 0) ? contents[0] : null;
}

function getAllContent(node, names) {
	return _.pluck(getChildNodes(node, names), 'content');
}

function removeNamespacePrefixes(xml) {
	return xml.replace(/<([\w|\-]+):/g, '<').replace(/<\/([\w|\-]+):/g, '</');
}

function decodeXML(text) {
	return (text) ? entities.decodeXML(text) : text;
}

function encodeXML(text) {
	return (text) ? entities.encodeXML(text) : text;
}
