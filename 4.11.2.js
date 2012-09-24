/* An implementation of a parser for the CFG described in exercise 4.11 of
 * Programming Language Pragmatics 3rd Edition page 207-8 with the addition
 * of semantic analysis in a second pass.
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var scanner = require('./scanner.js');
var parser = require('./parser.js');
var analyzer = require('./analyzer.js');

var tokenTypes = [
    { t:'digit', re:/^\d/ },
    { t:'.', re:/^\./ }
];

var parseGrammar = {
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

var attributeGrammar = analyzer.analyzer({
    'float': function(tree) {
        var lhs = this.analyze(tree[0]);
        var rhs = this.analyze(tree[2]);
        var decimalPlaces = rhs.toString().length;
        return lhs + (rhs * Math.pow(10, -decimalPlaces));
    },
    'digits': function(tree, beginning) {
        if (beginning === undefined) {
            beginning = 0;
        }
        var first_digit = parseInt(tree[0].text);
        return this.analyze(tree[1], (beginning * 10) + first_digit);
    },
    'more-digits': function(tree, beginning) {
        if (tree.length === 0) {
            return beginning;
        }
        return this.analyze(tree[0], beginning);
    }
});

var tests = [
    '1.0',
    '2.1234',
    '6345.904'
];

for (var i = 0; i < tests.length; i++) {
    var tokens = scanner.scan(tokenTypes, tests[i]);
    console.log(JSON.stringify(tokens));
    var tree = parser.parse(tokens, parseGrammar, "float");
    console.log(JSON.stringify(tree));
    var results = attributeGrammar.apply(tree);
    console.log(JSON.stringify(results[0]));
}