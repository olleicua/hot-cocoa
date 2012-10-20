/* Hot Cocoa Lisp
 *
 * An implementation of Booleans for Hot Cocoa Lisp in Javascript
 * Booleans also include true, false, and null
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var _Boolean = {};
_Boolean.type = "boolean";
_Boolean.bare = function() {
	return { "true": true, "false": false, "null": null	}[this.value];
};
_Boolean.toString = function() { return this.value; };
_Boolean.equivalent = function(other) { return this.value === other.value; };
_Boolean.bool = function() { return new_boolean(this.value === "true"); };
_Boolean.copy = function() { return new_boolean(this.value); };
_Boolean.eval = function() { return this; };

var new_boolean = function(value) {
	// TODO : add fractions (e.g. "1/2")
	var result = Object.create(_Boolean);
	if (value === true) {
		value = "true";
	}
	if (value === false) {
		value = "false";
	}
	if (value === null || value === undefined) {
		value = "null";
	}
	if (["true", "false", "null"].indexOf(value) === -1) {
		throw new Error("invalid boolean literal: " + value);
	}
	result.value = value;
	return result;
};

exports.new = new_boolean;