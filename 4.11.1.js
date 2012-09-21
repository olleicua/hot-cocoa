/* An implementation of a parser for the CFG described in exercise 4.11 of
 * Programming Language Pragmatics 3rd Edition page 207-8
 * 
 * Sam Auciello | September 2012 | http://opensource.org/licenses/mit-license.php
 */

var parser = require('./parser.js');

var tokensTypes = [
	{ t:'digit', re:/^\d/ },
	{ t:'.', re:/^\./ }
];

var grammar = {
	'float': [
		['digits', '.', 'digits']
	],
	'digits': [
		['digit', 'more-digits']
	],
	'more-digits': [
		['digits'],
		[]
	]
};

var firstMatch = function(text, pointer) {
	for (var i = 0; i < tokensTypes.length; i++) {
		var match = tokensTypes[i].re.exec(text);
		if (match) {
			return { type:tokensTypes[i].t, text:match[0], position:pointer };
		}
	}
	throw 'unrecognizable token at position ' + pointer;
}

var scanText = function(text) {
	var tokenList = [];
	var pointer = 0;
	while (pointer < text.length) {
		var match = firstMatch(text.substring(pointer), pointer);
		if (match.type !== 'whitespace') {
			tokenList.push(match);
		}
		pointer += match.text.length;
	}
	return tokenList;
};

var tests = [
	'1.0',
//	'2.1234',
//	'6345.904'
];

for (var i = 0; i < tests.length; i++) {
	var tokens = scanText(tests[i]);
	console.log(JSON.stringify(tokens));
	var tree = parser.parse(tokens, grammar, "float");
	console.log(JSON.stringify(tree));
}