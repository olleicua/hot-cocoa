/* Hot Cocoa Lisp
 *
 * An implementation of Macro literals for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var boolean = require('./boolean.js');

var _Macro = {};
_Macro.type = "macro";
_Macro.bare = function() {
	throw new Error("Macro cannot be represented as javascript");
}
_Macro.toString = function() {
    return "(# " + this.args.toString() +
	this.body.map(function(values) {
	    return values.toString();
	}).join(" ") + ")";
};
_Macro.equivalent = function(other) { return this === other; };
_Macro.bool = function() { return boolean.new(true); };
_Macro.eval = function() { return this; };
_Macro.copy = function() {
	return new_function(this.args.copy(), this.body.copy());
}
_Macro.call = function(args) {
    // TODO: think about what is evaled when.
	// Should a wrapper object eval to a javascript literal..?
    return this.func.apply(undefined, args.values);
}

var new_macro = function(args, body) {
    var result = Object.create(_Macro);
    // TODO: fill this in
    return result;
}

exports.new = new_macro;