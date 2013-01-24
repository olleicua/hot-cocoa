// scanner
exports.scan = require('./lib/scanner.js').scan;

// parser
exports.RD = 1;
exports.CYK = 2;
exports.parse = function(tokens, grammar, start_node, algorithm) {
    if (algorithm === exports.RD) {  // use recursive descent
        return require('./lib/RDparser.js').parse(tokens, grammar, start_node);
    } // use CYK
    return require('./lib/CYKparser.js').parse(tokens, grammar, start_node);
}

// analyzer
exports.analyzer = require('./lib/analyzer.js').analyzer;

// template
exports.format = require('./lib/template.js').format;
exports.template_map = require('./lib/template.js').template_map;
exports.formatFile = require('./lib/template.js').load;

// test
exports.test = require('./lib/test.js').test;