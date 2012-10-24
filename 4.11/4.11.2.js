/* An implementation of a parser for the CFG described in exercise 4.11 of
 * Programming Language Pragmatics 3rd Edition page 207-8 with the addition
 * of semantic analysis in a second pass.
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var scanner = require('../tools/scanner.js');
var parser = require('../tools/parser.js');
var analyzer = require('../tools/analyzer.js');

var tokenTypes = [
    { t:'digit', re:/^\d/ },
    { t:'.', re:/^\./ }
];

var parseGrammar = {
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

var attributeGrammar = analyzer.analyzer({
    '_float': function(tree) {
        var lhs = this.analyze(tree[0]);
        var rhs = this.analyze(tree[2]);
        var decimalPlaces = rhs.toString().length;
        return lhs + (rhs * Math.pow(10, -decimalPlaces));
    },
    '_digits': function(tree, beginning) {
        if (beginning === undefined) {
            beginning = 0;
        }
        var first_digit = parseInt(tree[0].text);
        return this.analyze(tree[1], (beginning * 10) + first_digit);
    },
    '_more-digits': function(tree, beginning) {
        if (tree.length === 0) {
            return beginning;
        }
        return this.analyze(tree[0], beginning);
    }
});

exports.scan = function(text) { return scanner.scan(tokenTypes, text); };
exports.parse = function(tokens) {
    return parser.parse(tokens, parseGrammar, "_float"); };
exports.analyze = function(tree) { return attributeGrammar.apply(tree); };

if (! module.parent) {
    var tests = [
        '1.0',
        '2.1234',
        '6345.904'
    ];

    for (var i = 0; i < tests.length; i++) {
        var tokens = scanner.scan(tokenTypes, tests[i]);
        console.log(JSON.stringify(tokens));
        var tree = parser.parse(tokens, parseGrammar, "_float");
        console.log(JSON.stringify(tree));
        var results = attributeGrammar.apply(tree);
        console.log(JSON.stringify(results[0]));
    }
}
