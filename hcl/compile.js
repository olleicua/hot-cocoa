var template = require('../tools/template.js');
var hcl = require('./hclParser.js');
var types = require('./lib/types.js');

var string2ast = function(string) {
    var tokens = hcl.scan(string);
    var tree = hcl.parse(tokens);
    return hcl.analyze(tree);
};

var macros = {};

var apply_macros = function(ast) {
	// TODO: implement this
	return ast;
}

var quaziquote = function(ast) {

    if (ast.type === 'list') {
        
        // unquote
        if (ast[0].json() === 'unquote') {
            return compile(ast[0]).json();
        }
        
        // quoted list
        return ast.map(function(value) {
            return quaziquote(value);
        }).json();
    }

    // atom
    return ast.json();
}

var compile = function(ast) {
    
    // lisp expression
    if (ast.type === 'list') {
        
        // formatted javascript
        if (ast[0].json() === 'quote') {
            return ast[1].json();
        }
        
        // formatted javascript
        if (ast[0].json() === 'quaziquote') {
            return quaziquote(ast[1]);
        }
        
        // formatted javascript
        if (ast[0].json() === 'js') {
            return template.format(
                ast[1].json(),
                types.list(ast.slice(2)).map(function(value) {
                    return compile(value);
                })
            );
        }
        
        // implement macro-exists
        if (ast[0].json() === 'macro-exists') {
            return macros[ast[1].json()] === undefined ? 'false' : 'true';
        }
        
        // TODO: add compile error handling here
        
        // formatted hcl
        return template.format('~~(~~)', [
            compile(ast[0]),
            types.list(ast.slice(1)).map(function(value) {
                return compile(value);
            }).join(', ')
        ]);
    }
    
    // scalar expression
    return ast.json();
    
    // TODO: add more tests
};

exports.compile = function(text) {
    
    var compiled_statements = [];
    var asts = string2ast(text);
    
    for (var i = 0; i < asts.length; i++) {
        var prepared_ast = apply_macros(asts[i]);
        // FIXME: macros should recursively apply to themselves..
        // I think this means a first pass to store macros
        if (prepared_ast[0].json() === 'macro') {
            var name = macros[prepared_ast[1].json()];
            if (name) {
                throw new Error('There is already a macro called ' + name);
                // TODO: add line number
            }
            macros[name] = prepared_ast;
        } else {
            compiled_statements.push(compile(prepared_ast) + ';');
        }
    }
    
    return compiled_statements.join('\n\n');
};