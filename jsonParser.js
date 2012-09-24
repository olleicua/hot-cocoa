/* A JSON parser
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var scanner = require('./scanner.js');
var parser = require('./parser.js');

var tokenTypes = [
    { t:'atom', re:/^(true|false|null)/ },
    { t:'number', re:/^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?/ },
    { t:'string', re:/^"(\\"|[^"])*"/ },
    { t:'{', re:/^{/ },
    { t:'}', re:/^}/ },
    { t:'[', re:/^\[/ },
    { t:']', re:/^\]/ },
    { t:',', re:/^,/ },
    { t:':', re:/^:/ },
    { t:'whitespace', re:/^\s*/ }
];

var grammar = {
    'value': [
        ['object'],
        ['array'],
        ['string'],
        ['number'],
        ['atom']
    ],
    'object': [
        ['{', 'string', ':', 'value', 'object-tail']
    ],
    'object-tail': [
        [',', 'string', ':', 'value', 'object-tail'],
        ['}']
    ],
    'array': [
        ['[', 'value', 'array-tail']
    ],
    'array-tail': [
        [',', 'value', 'array-tail'],
        [']']
    ]
};

var tests = [
    'true',
    '"crazystring"',
    '"this string has escapes in it \\" \\\\ \\\/"',
    '10.34',
    '982e-10',
    '1.2e3',
    '[1,2,3]',
    '{"x":1,"y":[true,false,null]}',
    '[{"a":1,"b":2},{"a":[null, null, null],"b":4.5}]'
];

for (var i = 0; i < tests.length; i++) {
    var tokens = scanner.scan(tokenTypes, tests[i]);
    var tree = parser.parse(tokens, grammar, "value");
    console.log(JSON.stringify(tree));
}