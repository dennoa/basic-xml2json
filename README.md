# basic-xml2json
Simple parser to convert XML strings to JSON.

## Usage
	var xml2json = require('basic-xml2json');
	
### parse
This code is based off the xml-parser here: [https://github.com/segmentio/xml-parser](https://github.com/segmentio/xml-parser). Please see that page for details of the JSON output.

The parse function takes an XML string (mandatory) and an object describing the options (optional).

	var json = xml2json.parse(xml, options);
	
#### parse options
*	removeNamespacePrefixes
	Boolean, defaults to true. Set this to false if you want to retain xml namespace prefixes in the JSON output.
	
		var options = { removeNamespacePrefixes: false };
		
### getChildNodes
Get an array of matching nodes under the specified parent node for the specified path.

	var json = xml2json.parse(xml);
	var nodes = xml2json.getChildNodes(json.root, ['Body','Response','Address']);
		
### getChildNode
Get the first matching node under the specified parent node for the specified path.

	var json = xml2json.parse(xml);
	var address = xml2json.getChildNode(json.root, ['Body','Response','Address']);
		
### getContent
Get the value of the first matching node under the specified parent node for the specified path. Encoded XML values will are decoded.

	var json = xml2json.parse(xml);
	var address = xml2json.getChildNode(json.root, ['Body','Response','Address']);
	var suburb = xml2json.getContent(address, 'Suburb');

Or
	var suburb = xml2json.getContent(json.root, ['Body','Response','Address','Suburb']);
		
### getAllContent
Get an array of values for the matching nodes under the specified parent node for the specified path. Encoded XML values will are decoded.

	var json = xml2json.parse(xml);
	var suburbs = xml2json.getAllContent(json.root, ['Body','Response','Address','Suburb']);

### decodeXML
Decode some text.

	var decodedText = decodeXML(text);
	
### encodeXML
Encode some text.

	var encodedText = encodeXML(text);
	
### Wildcard Matching
Probably rarely useful, but if you have a situation where you need to match elements with different paths (but at the same depth) then you can use a wildcard match. For example:

	<xmldoc>
		<postalAddress>
			<suburb>Brisbane</suburb>
		</postalAddress>
		<billingAddress>
			<suburb>Sydney</suburb>
		</billingAddress>
	</xmldoc>
	
	var json = xml2json.parse(xml);
	var suburbs = xml2json.getAllContent(json.root, [xml2json.ANY, 'suburb']);
	
In this example, suburbs will be ['Brisbane','Sydney'].
