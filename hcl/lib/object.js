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
	// currently the keys are simply the toString of the specified object here
	// but parsing is forcing it to be a string.  Should it be limitted to
	// strings..
	return this.object[key.toString()];
}
_Object.set = function(index, value) {
	this.object[key.toString()] = value;
	if (this.keys.indexOf(key.toString()) === -1) {
		this.keys.push(key.toString());
	}
	return value;
}
_Object.copy = function() {
	var result = new_object();
	for (var i = 0; i < this.keys.length; i++) {
		result.object[this.keys[i]] = this.object[this.keys[i]];
	}
	return result;
}

exports.new_object = function() {
	// TODO: test this
	var result = _Object.create(_Object);
	result.object = {};
	result.keys = [];
	for (var i = 1; i < arguments.length; i += 2) {
		result.keys.push(arguments[i - 1].toString());
		result.object[arguments[i - 1].toString()] = arguments[i];
	}
	return result;
}