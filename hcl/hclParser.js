/* Hot Cocoa Lisp
 *
 * An implementation of Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var number = require('./lib/types/number.js');
var string = require('./lib/types/string.js');
var word = require('./lib/types/word.js');
var list = require('./lib/types/list.js');
var boolean = require('./lib/types/boolean.js');
var scanner = require('../tools/scanner.js');
var parser = require('../tools/parser.js');
var analyzer = require('../tools/analyzer.js');

var tokenTypes = [ // TODO: add T and NIL
    { t:'boolean', re:/^(true|false|null|undefined)/ },
    { t:'number', re:/^-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?/ },
    { t:'string', re:/^"(\\"|[^"])*"/ },
    { t:'word',
      re:/^([a-zA-Z_!?$%&@#|*+\-=\/<>^][a-zA-Z0-9_!?$%&@#|*+\-=\/<>^]*)/ },
    { t:'(', re:/^\(/ },
    { t:')', re:/^\)/ },
    { t:'[', re:/^\[/ },
    { t:']', re:/^\]/ },
    { t:'{', re:/^{/ },
    { t:'}', re:/^}/ },
    { t:'\'', re:/^'/ },
    { t:'`', re:/^`/ },
    { t:'~', re:/^~/ },
    { t:'.', re:/^\./ },
    { t:'comment', re:/^;[^\n]*\n/ },
    { t:'whitespace', re:/^[\s,:]+/ }
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
        ['_puncuated-list'], // should '[ or '{ be allowed..? ..no!
        ['_dotted-chain'],
        ['_list'],
        ['_literal-list'],
        ['_object'],
        ['_atom']
    ],
    '_puncuated-list': [
        ['\'', '_expression'],
        ['`', '_expression'],
        ['~', '_expression']
    ],
    '_list': [
        ['(', '_list-tail']
    ],
    '_list-tail': [
        ['_expression', '_list-tail'],
        [')']
    ],
    '_dotted-chain': [
        ['_obj-reference', '.', 'word', '_dotted-chain-tail']
    ],
    '_obj-reference': [
        ['_list'],
        ['word']
    ],
    '_dotted-chain-tail': [
        ['.', 'word', '_dotted-chain-tail'],
        []
    ],
    '_literal-list': [
        ['[', '_literal-list-tail']
    ],
    '_literal-list-tail': [
        ['_expression', '_literal-list-tail'],
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
        ['.'],
        ['word'],
        ['string'],
        ['number'],
        ['boolean']
    ]
};

// generate an array of HCL expressions
var attributeGrammar = analyzer.analyzer({
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
        var result = list.new();
        switch (tree[0].type) {
        case '\'' :
            result.push(word.new('quote'));
            break;
        case '`' :
            result.push(word.new('quaziquote'));
            break;
        case '~' :
            result.push(word.new('unquote'));
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
            var result = list.new();
        }
        if (beginning) {
            result.unshift(beginning);
        }
        return result;
    },
    '_literal-list': function(tree) {
        var result = list.new();
        result.push(word.new('list'));
        var body = this.analyze(tree[1]);
        for (var i = 0; i < body.values.length; i++) {
            result.push(body.values[i]);
            // FIXME: the list wrappers are unneccessary and thus
            // so are the '.values's here
            // ???
        }
        return result;
    },
    '_literal-list-tail': function(tree, beginning) {
        return this['_list-tail'](tree, beginning);
    },
    '_object': function(tree) {
        var result = list.new();
        result.push(word.new('object'));
        var body = this.analyze(tree[1]);
        for (var i = 0; i < body.values.length; i++) {
            result.push(body.values[i]);
            // FIXME: the list wrappers are unneccessary and thus
            // so are the '.values's here
            // ???
        }
        return result;
    },
    '_object-tail': function(tree, args) {
        if (args) {
            var key = args[0];
            var value = args[1];
        }
        if (tree[0].type === '_atom') {
            var x = this.analyze(tree[1]);
            var result = this.analyze(tree[2], [this.analyze(tree[0]),
                                                this.analyze(tree[1])]);
        } else {
            var result = list.new();
        }
        if (key && value) {
            result.unshift(value);
            result.unshift(key);
        }
        return result;
    },
    '_dotted-chain': function(tree) {
        var result = list.new();
        result.push(word.new('.'));
        result.push(this.analyze(tree[0].tree[0]));
        result.push(this.analyze(tree[2]));
        var body = this.analyze(tree[3]);
        for (var i = 0; i < body.length; i++) {
            result.push(body[i]);
        }
        return result;
    },
    '_dotted-chain-tail': function(tree) {
        if (tree.length === 0) {
            return [];
        }
        var result = this.analyze(tree[2]);
        result.unshift(this.analyze(tree[1]));
        return result;
    },
    '_atom': function(tree) {
        switch (tree[0].type) { // perhaps without a switch??
        case 'word' :
            // TODO: add in regexp check
            return word.new(tree[0].text);
            break;
        case 'string' :
            return string.new(tree[0].text);
            break;
        case 'number' :
            return number.new(tree[0].text);
            break;
        case 'boolean' :
            return boolean.new(tree[0].text);
            break;
        }
    },
    'word': function(word) {
        return this['_atom']([word]);
    }
});

exports.scan = function(text) {
    var tokens = scanner.scan(tokenTypes, text);
    return tokens;
};
exports.parse = function(tokens) {
    // TODO: assert that the entire input has been parsed
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
