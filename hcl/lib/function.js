/* Hot Cocoa Lisp
 *
 * An implementation of Function literals for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var _Function = {};
_Function.type = "function";
_Function.toString = function() {
    return "(# " + this.args.toString() +
	this.body.map(function(values) {
	    return values.toString();
	}).join(" ") + ")";
};
_Function.eval = function() { return this; };
_Function.copy = function() { 
    return new_function(this.args.copy(), this.body.copy());
}
_Function.call = function(args) {
    // TODO: think about what is evaled when.  Should a wrapper object eval to a javascript literal..?
    return this.func.apply(undefined, args.values);
}

exports.new_function = function(args, body) {
    var result = Object.create(_Function);
    // TODO: fill this in
    return result;
}