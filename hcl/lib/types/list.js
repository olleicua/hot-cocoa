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
_List.bare = function() {
    var result = [];
    for (var i = this.zero_index; i < this.values.length; i++) {
        result.push(this.values[i].bare());
    }
    return result;
}
_List.zero_index = 0;
_List.string = function() { // should this be printed with '['s?
	var sp_separated = (this.size() > 1) ?
		this.reduce(function(value1, value2) {
			return (value1.string ? value1.string() : value1) + " " +
				(value2.string ? value2.string() : value2);
		}) : (this.size() === 1) ? this.first().string() : "";
    return "(" + sp_separated + ")";
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
    if (index.type === 'number') {
        var _index = index.value
        while (_index < 0) { // make negatives wrap around
            _index += this.size();
        }
        return this.values[this.zero_index + _index];
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
_List.reduce = function(func, initial) {
	var result = initial;
	var offset = 0;
	if (initial === undefined) {
		if (this.size() === 0) {
			throw new Error("Cannot reduce list of zero length");
		}
		var result = this.first();
		var offset = 1;
	}
    for (var i = this.zero_index + offset; i < this.values.length; i++) {
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
