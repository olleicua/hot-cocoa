/* Hot Cocoa Lisp
 *
 * An implementation of Lists for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var _List = [];
_List.type = "list";
_String.toString = function() { return this.text; };
_List.zero_index = 0;
_List.get = function(index) {
	if (index.type === 'number') {
		return this[this.zero_index + index.value];
	}
}
_List.set = function(index, value) {
	if (index.type === 'number') {
		return this[this.zero_index + index.value] = value;
	}
}
_List.first = function() {
	return this[this.zero_index];
}
_List.rest = function() {
	// This is wrong, we want pointers. _List should be a real wrapper..
	var result = Object.create(this);
	result.zero_index = this.zero_index + 1;
	return result;
}
_List.toArray = function() { // is this necessary??
	var result = [];
	for (var i = this.zero_index; i < this.length; i++) {
		result.push(this[i]);
	}
	return result;
}
_List.map = function(func) {
	var result = Object.create(_List);
	for (var i = this.zero_index; i < this.length; i++) {
		result.push(func(this[i]));
	}
	return result;
}
_List.filter = function(func) {
	var result = Object.create(_List);
	for (var i = this.zero_index; i < this.length; i++) {
		if (func(this[i])) {
			result.push(this[i]);
		}
	}
	return result;
}
_List.reduce = function(func, init) {
	var result = init;
	for (var i = this.zero_index; i < this.length; i++) {
		result = func(result, this[i]);
	}
	return result;
}
_List.copy = function() {
	// TODO
}

exports.new_list = function() {
	var result = Object.create(_List);
	for (var i = 0; i < arguments.length; i++) {
		result.push(arguments[i]);
	}
	return result;
}