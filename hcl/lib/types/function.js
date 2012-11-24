/* Hot Cocoa Lisp
 *
 * An implementation of Function literals for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var boolean = require('./boolean.js');
var list = require('./list.js');

var _Function = {};
_Function.type = "function";
_Function.bare = function() {
    var that = this;
    return function() {
        return that.call(list.new(arguments));
        // TODO: handle arguments properly (they may need to be wrapped..)
    }
}
_Function.string = function() {
    return "(# " + this.args.string() +
    this.body.map(function(values) {
        return values.string();
    }).join(" ") + ")";
};
_Function.equivalent = function(other) { return this === other; };
_Function.bool = function() { return boolean.new(true); };
_Function.eval = function() { return this; };
_Function.copy = function() {
    return new_function(this.args.copy(), this.body.copy());
}
_Function.call = function(args) {
    // TODO: think about what is evaled when.  Should a wrapper object eval to a
    // javascript literal..?
    return this.func(args);
}

var new_function = function(args, body) {
    var result = Object.create(_Function);
    // TODO: fill this in
    return result;
}

var new_function_from_js = function(context, func) {
    var result = Object.create(_Function);
    result.context = context; // preserve this
    result.func = function(args) {
        return func.apply(context, args.bare());
    }
    return result;
}

exports.new = new_function;
exports.new_from_js = new_function_from_js;
exports._Function = _Function;
