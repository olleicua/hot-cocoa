/* Parsing PLL (Propositional Logic Language)
 *
 * A simple toy problem of a Propositional logic calculator language with
 * variables
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var scanner = require('../tools/scanner.js');
var parser = require('../tools/parser.js');
var analyzer = require('../tools/analyzer.js');

var tokenTypes = [
    { t:'infix-operator', re:/^(and|or|implies|xor|iff)\b/ },
    { t:'prefix-operator', re:/^not\b/ },
    { t:'literal', re:/^(true|false)\b/ },
    { t:'variable', re:/^[a-zA-Z_][a-zA-Z0-9_]*/ },
    { t:'(', re:/^\(/ },
    { t:')', re:/^\)/ },
    { t:'=', re:/^=/ },
    { t:'newline', re:/^\n/ },
    { t:'whitespace', re:/^[ \t]+/ }
];

var parseGrammar = {
    '_program': [
        ['_statement', '_program-tail'],
    ],
    '_program-tail': [
        ['newline', '_program'],
        ['newline', '_eof'],
        ['_eof']
    ],
    '_statement': [
        ['_assignment'],
        ['_expression']
    ],
    '_assignment': [
        ['variable', '=', '_expression']
    ],
    '_expression': [
        ['_unambiguous-expression', 'infix-operator', '_unambiguous-expression'],
        ['_unambiguous-expression']
    ],
    '_unambiguous-expression': [
        ['literal'],
        ['variable'],
        ['(', '_expression', ')'],
        ['prefix-operator', '_unambiguous-expression']
    ]
};

var attributeGrammar = analyzer.analyzer({
    'variables': {},
    '_program': function(tree) {
        console.log(this.analyze(tree[0]));
        this.analyze(tree[1]);
    },
    '_program-tail': function(tree) {
        if (tree[1] && tree[1].type === '_program') {
            this.analyze(tree[1]);
        }
    },
    '_statement': function(tree) {
        return this.analyze(tree[0]);
    },
    '_assignment': function(tree) {
        var expression = this.analyze(tree[2]);
        this.variables[tree[0].text] = expression;
        return expression;
    },
    '_expression': function(tree) {
        if (tree[1] === undefined) {
            return this.analyze(tree[0]);
        }
        switch (tree[1].text) {
        case 'and' :
            return this.analyze(tree[0]) && this.analyze(tree[2]);
            break;
        case 'or' :
            return this.analyze(tree[0]) || this.analyze(tree[2]);
            break;
        case 'implies' :
            return (! this.analyze(tree[0])) || this.analyze(tree[2]);
            break;
        case 'xor' :
            return this.analyze(tree[0]) !== this.analyze(tree[2]);
            break;
        case 'iff' :
            return this.analyze(tree[0]) === this.analyze(tree[2]);
            break;
        }
    },
    '_unambiguous-expression': function(tree) {
        switch (tree[0].type) {
        case 'literal' :
            return tree[0].text === 'true';
            break;
        case 'variable' :
            if (this.variables[tree[0].text] === undefined) {
                throw "variable " + tree[0].text + " referenced before assignment";
            }
            return this.variables[tree[0].text];
            break;
        case '(' :
            return this.analyze(tree[1]);
            break;
        case 'prefix-operator' :
            if (tree[0].text === 'not') {
                return ! this.analyze(tree[1]);
            }
            throw 'prefix operator other then "not" WAT!!'
            break;
        }
    }
});

exports.scan = function(text) {
    var tokens = scanner.scan(tokenTypes, text);
    tokens.push({type:'_eof'});
    return tokens;
};
exports.parse = function(tokens) {
    return parser.parse(tokens, parseGrammar, "_program");
};
exports.analyze = function(tree) {
    attributeGrammar.apply(tree);
};

if (! module.parent) {
    var tests = [
        'true',
        'true and false',
        '(true and true) or false',
        'p = true\nq = false\n(p and q) implies (p or q)'
    ];

    for (var i = 0; i < tests.length; i++) {
        console.log('---');
        var tokens = scanner.scan(tokenTypes, tests[i]);
        tokens.push({type:'_eof'});
        // console.log(JSON.stringify(tokens));
        var tree = parser.parse(tokens, parseGrammar, "_program");
        // console.log(JSON.stringify(tree));
        attributeGrammar.apply(tree);
    }
}
