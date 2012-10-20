/* Hot Cocoa Lisp
 *
 * A wrapper implementation for Objects in Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var boolean = require('./boolean.js');

var _Object = {};
_Object.type = "object";
_Object.bare = function() {	return this.object; };
_Object.toString = function() {
	var that = this;
	return "{" + this.keys.map(function(key) {
		return key.toString() + " " + that.get(key).toString();
	}).join(" ") + "}";
};
_Object.equivalent = function(other) {
	if (this.keys.length !== other.keys.length) {
		return false;
	}
	for (var i = 0; i < this.keys.length; i++) {
		if (other.keys.indexOf(this.keys[i]) === -1) {
			return false;
		}
		if (! this.get(this.keys[i]).equivalent(other.get(this.keys[i]))) {
			return false;
		}
	}
	return true;
};
_Object.bool = function() { return boolean.new(this.keys.length !== 0); };
_Object.eval = function() { return this; };
_Object.get = function(key) {
	// currently the keys are simply the toString of the specified object here
	// but parsing is forcing it to be a string.  Should it be limitted to
	// strings..
	return this.object[key.toString()];
};
_Object.set = function(key, value) {
	this.object[key.toString()] = value;
	if (this.keys.indexOf(key.toString()) === -1) {
		this.keys.push(key.toString());
	}
	return value;
};
_Object.copy = function() {
	var result = new_object();
	for (var i = 0; i < this.keys.length; i++) {
		result.keys.push(this.keys[i]);
		result.object[this.keys[i]] = this.object[this.keys[i]].copy();
	}
	return result;
};

var new_object = function() {
	var result = Object.create(_Object);
	result.object = {};
	result.keys = [];
	for (var i = 1; i < arguments.length; i += 2) {
		result.keys.push(arguments[i - 1].toString());
		result.object[arguments[i - 1].toString()] = arguments[i];
	}
	return result;
};

exports.new = new_object;