/* Hot Cocoa Lisp
 *
 * An implementation of Numbers for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var _Number = {};
_Number.type = "number";
_String.toString = function() { return this.text; };

exports.new_number = function(number) {
	// TODO : add fractions (e.g. "1/2")
	var result = Object.create(_Number);
	result.value = parseFloat(number);
	result.text = number.toString();
	return result;
}