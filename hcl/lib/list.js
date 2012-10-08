/* Hot Cocoa Lisp
 *
 * An implementation of Lists for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var List = [];
List.type = "list";
List.zero_index = 0;
List.get = function(index) {
	return this[this.zero_index + index];
}
List.set = function(index, value) {
	return this[this.zero_index + index] = value;
}
List.first = function() {
	return this[this.zero_index];
}
List.rest = function() {
	var result = Object.create(this);
	result.zero_index = this.zero_index + 1;
	return result;
}
List.toArray = function() { // is this necessary??
	var result = [];
	for (var i = this.zero_index; i < this.length; i++) {
		result.push(this[i]);
	}
	return result;
}
List.map = function(func) {
	var result = Object.create(List);
	for (var i = this.zero_index; i < this.length; i++) {
		result.push(func(this[i]));
	}
	return result;
}
List.filter = function(func) {
	var result = Object.create(List);
	for (var i = this.zero_index; i < this.length; i++) {
		if (func(this[i])) {
			result.push(this[i]);
		}
	}
	return result;
}
List.reduce = function(func, init) {
	var result = init;
	for (var i = this.zero_index; i < this.length; i++) {
		result = func(result, this[i]);
	}
	return result;
}
List.copy = function() {
	// TODO
}

exports.new_list = function() {
	var result = Object.create(List);
	for (var i = 0; i < arguments.length; i++) {
		result.push(arguments[i]);
	}
	return result;
}