/* An implementation of a parser for the CFG described in exercise 4.11 of
 * Programming Language Pragmatics 3rd Edition page 207-8
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var scanner = require('./scanner.js');
var parser = require('./parser.js');

var tokenTypes = [
    { t:'digit', re:/^\d/ },
    { t:'.', re:/^\./ }
];

var grammar = {
    '_float': [
        ['_digits', '.', '_digits']
    ],
    '_digits': [
        ['digit', '_more-digits']
    ],
    '_more-digits': [
        ['_digits'],
        []
    ]
};

var tests = [
    '1.0',
    '2.1234',
    '6345.904'
];

for (var i = 0; i < tests.length; i++) {
    var tokens = scanner.scan(tokenTypes, tests[i]);
    console.log(JSON.stringify(tokens));
    var tree = parser.parse(tokens, grammar, "_float");
    console.log(JSON.stringify(tree));
}