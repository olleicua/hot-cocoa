/* Hot Cocoa Lisp
 *
 * A wrapper implementation for Objects in Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var _Object = {};
_Object.type = "object";
_Object.get = function(key) {
	return this.object[key.toString()];
}
_Object.set = function(index, value) {
	return this.object[key.toString()] = value;
}
_Object.copy = function() {
	// TODO
}

exports.new_list = function() {
	// TODO: test this
	var result = _Object.create(_Object);
	result.object = {};
	for (var i = 1; i < arguments.length; i += 2) {
		result.object[arguments[i - 1]] = arguments[i];
	}
	return result;
}