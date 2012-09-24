/* Parsing PLL (Propositional Logic Language)
 *
 * A simple toy problem of a Propositional logic calculator language with
 * variables
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var scanner = require('./scanner.js');
var parser = require('./parser.js');

var tokensTypes = [
	{ t:'infix-operator', re:/^(and|or|implies|xor|iff)\b/ },
	{ t:'preix-operator', re:/^not\b/ },
	{ t:'literal', re:/^(true|false)\b/ },
	{ t:'variable', re:/^[a-zA-Z_][a-zA-Z0-9_]*/ },
	{ t:'(', re:/^\("/ },
	{ t:')', re:/^\)/ },
	{ t:'=', re:/^=/ },
	{ t:'newline', re:/^\n/ },
	{ t:'whitespace', re:/^\s*/ }
];

var grammar = {
	'program': [
		['statement', 'program-tail']
	],
	'program-tail': [
		['newline', 'program'],
		[]
	],
	'statement': [
		['assignment'],
		['expression']
	],
	'assignment': [
		['variable', '=', 'expression']
	],
	'expression': [
		[''] // How do I differenciate between 'true' and 'true and false' in a
		     // single look-ahead recursive top down parser?
	]
};

var tests = [
	'true',
	'true and false',
	'p = true\nq = false\n(p and q) implies (p or q)'
];

for (var i = 0; i < tests.length; i++) {
	var tokens = scanner.scan(tokenTypes, tests[i]);
	var tree = parser.parse(tokens, grammar, "value");
	console.log(JSON.stringify(tree));
}