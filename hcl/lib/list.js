/* Hot Cocoa Lisp
 *
 * An implementation of Lists for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var boolean = require('./boolean.js');

var _List = {};
_List.type = "list";
_List.zero_index = 0;
_List.toString = function() { // should this be printed with '['s?
	return "(" + this.values.map(function(values) {
		return values.toString();
	}).join(" ") + ")";
};
_List.equivalent = function(other) {
	if (this.size() !== other.size()) {
		return false;
	}
	for (var i = 0; i < this.size(); i++) {
		if (! this.get(i).equivalent(other.get(i))) {
			return false;
		}
	}
	return true;
};
_List.bool = function() { return boolean.new(this.size() !== 0); } ;
_List.eval = function() {
    return this.first.eval().call(this.rest());
}
_List.copy = function() { // deep copy
    return this.map(function(value) {
	    return value.copy();
	});
}
_List.get = function(index) {
    while (index < 0) { // make negatives wrap around
	index += this.size();
    }
    if (index.type === 'number') {
		return this.values[this.zero_index + index.value];
    } // should return undefined be explicit?
}
_List.set = function(index, value) {
	if (index.type === 'number') {
		return this.values[this.zero_index + index.value] = value;
	}
}
_List.first = function() {
	return this.values[this.zero_index];
}
_List.rest = function() {
	var result = Object.create(_List);
	result.zero_index = this.zero_index + 1;
	result.values = this.values;
	return result;
}
_List.size = function() {
	return this.values.length - this.zero_index;
}
_List.toArray = function() { // is this necessary??
	var result = [];
	for (var i = this.zero_index; i < this.values.length; i++) {
		result.push(this.values[i]);
	}
	return result;
}
_List.map = function(func) {
	var result = new_list();
	for (var i = this.zero_index; i < this.values.length; i++) {
		result.values.push(func(this.values[i]));
	}
	return result;
}
_List.filter = function(func) {
	var result = new_list();
	for (var i = this.zero_index; i < this.values.length; i++) {
		if (func(this.values[i])) {
			result.values.push(this.values[i]);
		}
	}
	return result;
}
_List.reduce = function(func, init) {
	var result = init;
	for (var i = this.zero_index; i < this.values.length; i++) {
		result = func(result, this.values[i]);
	}
	return result;
}

var new_list = function() {
	var result = Object.create(_List);
	result.values = [];
	for (var i = 0; i < arguments.length; i++) {
		result.values.push(arguments[i]);
	}
	return result;
}

exports.new = new_list;