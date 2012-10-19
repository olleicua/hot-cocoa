/* Hot Cocoa Lisp
 *
 * An implementation of Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var number = require('./lib/number.js');
var string = require('./lib/string.js');
var word = require('./lib/word.js');
var list = require('./lib/list.js');
var scanner = require('../scanner.js');
var parser = require('../parser.js');
var analyzer = require('../analyzer.js');

var tokenTypes = [ // TODO: add T and NIL
    { t:'boolean', re:/^(true|false|null|undefined)/ },
    { t:'number', re:/^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?/ },
    { t:'string', re:/^"(\\"|[^"])*"/ },
    { t:'word', re:/^[a-zA-Z_!?$%&*+-=\/<>^~][a-zA-Z0-9_!?$%&*+-=\/<>^~]*\b/ },
    { t:'(', re:/^\(/ },
    { t:')', re:/^\)/ },
    { t:'[', re:/^\[/ },
    { t:']', re:/^\]/ },
    { t:'{', re:/^{/ },
    { t:'}', re:/^}/ },
    { t:'\'', re:/^'/ },
    { t:'`', re:/^`/ },
    { t:',', re:/^,/ },
    { t:'whitespace', re:/^\s+/ }
];

var parseGrammar = {
    '_program': [
        ['_expression', '_program-tail'],
    ],
	'_program-tail': [
		['_program'],
		[]
	],
    '_expression': [
		['_puncuated-list'], // should '[ or '{ be allowed..?
        ['_list'],
        ['_data-list'], // this needs a better name
        ['_object'],
        ['_atom']
    ],
	'_puncuated-list': [
		['\'', '_expression'],
		['`', '_expression'],
		[',', '_expression']
	],
	// TODO : add lists and objects
	'_list': [
		['(', '_list-tail']
	],
	'_list-tail': [
		['_expression', '_list-tail'],
		[')']
	],
	'_data-list': [
		['[', '_data-list-tail']
	],
	'_data-list-tail': [
		['_expression', '_data-list-tail'],
		[']']
	],
	'_object': [
		['{', '_object-tail']
	],
	'_object-tail': [
		['_atom', '_expression', '_object-tail'],
		['}']
	],
	'_atom': [
		['word'],
		['string'],
		['number'],
		['boolean']
	]
};

// generate an array of HCL expressions
var attributeGrammar = analyzer.analyzer({
	// Do we want this here?? .. no?
	// 'variables': {},
    '_program': function(tree) {
        return this.analyze(tree[1], this.analyze(tree[0]));
    },
	'_program-tail': function(tree, beginning) {
		if (tree[0] && tree[0].type === '_program') {
			var result = this.analyze(tree[0]);
		} else {
			var result = [];
		}
		result.unshift(beginning);
		return result;
	},
    '_expression': function(tree) {
		return this.analyze(tree[0]);
	},
    '_puncuated-list': function(tree) {
		var result = list.new_list();
		switch (tree[0]) {
		case '\'' :
			result.push(word.new_word('quote'));
			break;
		case '`' :
			result.push(word.new_word('quaziquote'));
			break;
		case ',' :
			result.push(word.new_word('unquote'));
			break;
		}
		result.push(this.analyze(tree[1]));
		return result;
	},
    '_list': function(tree) {
		return this.analyze(tree[1]);
	},
    '_list-tail': function(tree, beginning) {
		if (tree[0].type === '_expression') {
			var result = this.analyze(tree[1], this.analyze(tree[0]));
		} else {
			var result = list.new_list();
		}
		if (beginning) {
			result.unshift(beginning);
		}
		return result;
	},
    '_data-list': function(tree) {
		var result = list.new_list();
		result.push(word.new_word('list'));
		result.push(this.analyze(tree[1]));
		return result;
	},
	'_data-list-tail': function(tree, beginning) {
		return this['_list-tail'](tree, beginning);
	},
    '_object': function(tree) { // should this just build the object??
		var result = list.new_list();
		result.push(word.new_word('object'));
		result.push(this.analyze(tree[1]));
		return result;
	},
    '_object-tail': function(tree, args) {
		if (args) {
			var key = args[0];
			var value = args[1];
		}
		if (tree[0].type === '_atom') {
			var x = this.analyze(tree[1]);
			var result = this.analyze(tree[2], [this.analyze(tree[0]), this.analyze(tree[1])]);
		} else {
			var result = list.new_list();
		}
		if (key && value) {
			result.unshift(value);
			result.unshift(key);
		}
		return result;
	},
    '_atom': function(tree) {
		switch (tree[0].type) { // perhaps without a switch??
		case 'word' :
			return word.new_word(tree[0].text);
			break;
		case 'string' :
			return string.new_string(tree[0].text);
			break;
		case 'number' :
			return number.new_number(tree[0].text);
			break;
		}
		case 'boolean' :
			return boolean.new_boolean(tree[0].text);
			break;
		}
	},
});

exports.scan = function(text) {
	var tokens = scanner.scan(tokenTypes, text);
	return tokens;
};
exports.parse = function(tokens) {
	return parser.parse(tokens, parseGrammar, "_program");
};
exports.analyze = function(tree) {
	return attributeGrammar.apply(tree)[0];
};

if (! module.parent) {
	var tests = [
		'(console.log "Hello World!")',
		'[1 2 3 4 7e2]',
		'{"a" 1 "b" 2}'
	];

	for (var i = 0; i < tests.length; i++) {
		console.log('---');
		var tokens = scanner.scan(tokenTypes, tests[i]);
		console.log(JSON.stringify(tokens));
		console.log('---');
		var tree = parser.parse(tokens, parseGrammar, "_program");
		console.log(JSON.stringify(tree));
		console.log('---');
		var lists = attributeGrammar.apply(tree)[0];
		console.log(JSON.stringify(lists));
	}
}
