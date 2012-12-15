var template = require('../../tools/template.js');

var compile = function(ast) {
    // TODO: indentation
    return template.format("function(~args~) {\n~body~}",
                           {args: ast[1].names().join(', '),
                            body: /* TODO: fill this in.. */ });
}

exports.compile = compile;