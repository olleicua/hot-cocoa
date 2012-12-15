var template = require('../../tools/template.js');

var compile = function(ast, r_value) {
    if (r_value) {
        // return the assignment wrapped in parentheses
        return template.format("(~~)", [compile(ast)]);
    }
    // TODO: verify that ast[1] is a symbol
    return template.format("var ~~ = ~~;", [ast[1].name, ast[2].eval("R")]);
}

exports.compile = compile;