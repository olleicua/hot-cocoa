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

var tokenTypes = [
    { t:'infix-operator', re:/^(and|or|implies|xor|iff)\b/ },
    { t:'prefix-operator', re:/^not\b/ },
    { t:'literal', re:/^(true|false)\b/ },
    { t:'variable', re:/^[a-zA-Z_][a-zA-Z0-9_]*/ },
    { t:'(', re:/^\(/ },
    { t:')', re:/^\)/ },
    { t:'=', re:/^=/ },
    { t:'newline', re:/^\n/ },
    { t:'whitespace', re:/^\s+/ }
];

var grammar = {
    '_program': [
        ['_statement', '_program-tail'],
    ],
	'_program-tail': [
		['_program'],
		[]
	],
    '_statement': [
        ['_assignment'],
        ['_expression']
    ],
    '_assignment': [
        ['variable', '=', '_expression']
    ],
    '_expression': [
        ['_unambiguous-expression', 'newline'],
        ['_unambiguous-expression', 'infix-operator', '_unambiguous-expression', 'newline']
    ],
	'_unambiguous-expression': [
		['literal'],
		['(', '_expression', ')'],
		['prefix-operator', '_unambiguous-expression']
	]
};

var tests = [
    'true\n',
    'true and false\n',
    'p = true\nq = false\n(p and q) implies (p or q)'
];

for (var i = 0; i < tests.length; i++) {
    var tokens = scanner.scan(tokenTypes, tests[i]);
    console.log('---');
    console.log(JSON.stringify(tokens));
    var tree = parser.parse(tokens, grammar, "_program");
    console.log(JSON.stringify(tree));
}