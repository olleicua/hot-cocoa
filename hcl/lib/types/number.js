/* Hot Cocoa Lisp
 *
 * An implementation of Numbers for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var boolean = require('./boolean.js');

var _Number = {};
_Number.type = "number";
_Number.bare = function() { return this.value; };
_Number.string = function() { return this.text; };
_Number.equivalent = function(other) { return this.value === other.value; };
_Number.bool = function() { return boolean.new(this.value !== 0); };
_Number.copy = function() { return new_number(this.value); }; 
_Number.eval = function() { return this; };

var new_number = function(number) {
    // TODO : add fractions (e.g. "1/2")
    var result = Object.create(_Number);
    result.value = parseFloat(number);
    result.text = result.value.toString();
    return result;
}

exports.new = new_number;
