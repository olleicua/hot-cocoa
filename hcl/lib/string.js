/* Hot Cocoa Lisp
 *
 * An implementation of Strings for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var _String = {};
_String.type = "string";
_String.toString = function() { return this.value; };
_String.copy = function() { return new_string(this.value); }
_String.eval = function() { return this; };

exports.new_string = function(string) {
	var result = Object.create(_String);
	// TODO : do this right .. how? .. maybe not..
	result.value = new Function('return ' + string + ';')();
	return result;
}