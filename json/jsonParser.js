/* A JSON parser
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var scanner = require('../tools/scanner.js');
var parser = require('../tools/parser.js');

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
    '_value': [
        ['_object'],
        ['_array'],
        ['string'],
        ['number'],
        ['atom']
    ],
    '_object': [
        ['{', 'string', ':', '_value', '_object-tail']
    ],
    '_object-tail': [
        [',', 'string', ':', '_value', '_object-tail'],
        ['}']
    ],
    '_array': [
        ['[', '_value', '_array-tail']
    ],
    '_array-tail': [
        [',', '_value', '_array-tail'],
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
    var tree = parser.parse(tokens, grammar, "_value");
    console.log(JSON.stringify(tree));
}
