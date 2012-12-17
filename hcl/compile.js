var template = require('../tools/template.js');
var hcl = require('./hclParser.js');

var string2ast = function(string) {
    var tokens = hcl.scan(string);
    var tree = hcl.parse(tokens);
    return hcl.analyze(tree);
};

// TODO: fix the infrastructure
// all types need a 'stringify' method as well as a bare method
// perhaps no infrastructure is needed at all...?
// I think I want to leave everything literal except for strings and words which
// will be objects with a relevant .toJSON method implemented:
// https://developer.mozilla.org/en-US/docs/JSON
// possibly also overriding all of the .toString methods..?

var macros = {};

var quaziquote = function(ast) {

    if (ast.type === 'list') {
        
        // unquote
        if (ast.first().bare() === 'unquote') {
            return compile(ast.get(1)).bare();
        }
        
        // quoted list
        return ast.map(function(value) {
            return quaziquote(value);
        });
    }

    // TODO: add macro-exists here

    // TODO: add compile error here
    
    // atom
    return ast.bare();
}

var compile = function(ast) {
    
    // lisp expression
    if (ast.type === 'list') {
        
        // formatted javascript
        if (ast.first().bare() === 'quote') {
            // TODO: quoted words need to be represented somehow..?
            return ast.get(1).bare();
        }
        
        // formatted javascript
        if (ast.first().bare() === 'quaziquote') {
            return quaziquote(ast.get(1));
        }
        
        // formatted javascript
        if (ast.first().bare() === 'js') {
            return template.format(
                ast.get(1),
                ast.rest().rest().map(function(value) {
                    return compile(value);
                })
            );
        }
        
        // formatted hcl
        return template.format('~~(~~)', [
            compile(ast.first()),
            ast.rest().map(function(value) {
                //console.log(value, value.bare(), compile(value), value.type);
                return compile(value);
            }).bare().join(', ')
        ]);
    }
    
    // scalar expression
    //console.log(ast, ast.bare());
    return ast.bare();
    // TODO: add more tests
};

exports.compile = function(text) {
    
    var compiled_statements = [];
    var asts = string2ast(text);
    
    for (var i = 0; i < asts.length; i++) {
        var prepared_ast = asts[i];
        // TODO: implement this
        // var prepared_ast = apply_macros(asts[i]);
        // FIXME: macros should recursively apply to themselves..
        if (prepared_ast.first().bare() === 'macro') {
            var name = macros[prepared_ast.get(1).bare()];
            if (name) {
                throw new Error('There is already a macro called ' + name);
                // TODO: add line number
            }
            macros[name] = prepared_ast;
        } else {
            //console.log(JSON.stringify(compile(prepared_ast)), JSON.stringify(prepared_ast));
            compiled_statements.push(compile(prepared_ast) + ';');
        }
    }
    
    return compiled_statements.join('\n\n');
};