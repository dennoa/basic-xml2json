'use strict';

var should = require('should');
var xml2json = require('../index.js');
var fs = require('fs');

describe('simple-xml2json', function() {

	var soapXml;

  beforeEach(function(done) {
    fs.readFile(__dirname + '/sample-soap.xml', 'utf8', function(err, xml) {
      soapXml = xml;
      done(err);
    });
  });

  it('should parse a soap response', function(done) {
    var json = xml2json.parse(soapXml, { removeNamespacePrefixes: false });
    json.root.name.should.equal('soapenv:Envelope');
    json.root.attributes['xmlns:soapenv'].should.equal('http://schemas.xmlsoap.org/soap/envelope/');
    json.root.children[0].name.should.equal('soapenv:Header');
    json.root.children[1].name.should.equal('soapenv:Body');
    done();
  });
	
  it('should remove namespace prefixes from xml', function(done) {
    var pos = soapXml.indexOf('<soapenv:Envelope');
    pos.should.not.equal(-1);
    var simpleXml = xml2json.removeNamespacePrefixes(soapXml);
    simpleXml.indexOf('<soapenv:Envelope').should.equal(-1);
    simpleXml.indexOf('<Envelope').should.equal(pos);
    done();
  });
	
  it('should remove namespace prefixes from xml by default when parsing to json', function(done) {
    var json = xml2json.parse(soapXml);
    json.root.name.should.equal('Envelope');
    json.root.children[0].name.should.equal('Header');
    json.root.children[1].name.should.equal('Body');
    done();
  });
	
  it ('should get all nodes for a given path', function(done) {
    var json = xml2json.parse(soapXml);
    var susans = xml2json.getChildNodes(json.root, ['Body','responseWrapper','responseObject','barry','susan']);
    susans.length.should.equal(2);
    done();
  });
	
  it ('should get first node for a given path', function(done) {
    var json = xml2json.parse(soapXml);
    var addr = xml2json.getChildNode(json.root, ['Body','responseWrapper','responseObject','barry','susan','partyAddress']);
    xml2json.getContent(addr, 'type').should.equal('Mailing');
    done();
  });
	
  it('should get content for a given path', function(done) {
    var json = xml2json.parse(soapXml);
    xml2json.getContent(json.root, ['Body','responseWrapper','responseObject','barry','sensitive']).should.equal('false');
    done();
  });
	
  it('should allow the use of a wildcard to replace a path element when getting content', function(done) {
    var json = xml2json.parse(soapXml);
    xml2json.getContent(json.root, ['Body','responseWrapper','responseObject',xml2json.ANY,'sensitive']).should.equal('false');
    done();
  });
	
  it('should allow the use of multiple wildcards to replace multiple path elements when getting content', function(done) {
    var json = xml2json.parse(soapXml);
    xml2json.getContent(json.root, ['Body',xml2json.ANY,xml2json.ANY,xml2json.ANY,xml2json.ANY,'partyAddress','suburb']).should.equal('Melbourne');
    done();
  });
	
  it('should get all content for a given path', function(done) {
    var json = xml2json.parse(soapXml);
    var suburbs = xml2json.getAllContent(json.root, ['Body','responseWrapper','responseObject','barry','susan','partyAddress','suburb']);
    suburbs.length.should.equal(2);
    suburbs[0].should.equal('Melbourne');
    suburbs[1].should.equal('Brisbane');
    done();
  });
	
  it('should decode the xml content', function(done) {
    var json = xml2json.parse(soapXml);
    var addr = xml2json.getChildNode(json.root, ['Body','responseWrapper','responseObject','barry','susan','partyAddress']);
    xml2json.getContent(addr, ['addressLine1']).should.equal('123 < 456');
    xml2json.getContent(addr, ['addressLine2']).should.equal('Cnr One & Two');
    done();
  });
  
});
