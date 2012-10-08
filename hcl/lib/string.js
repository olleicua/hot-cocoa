/* Hot Cocoa Lisp
 *
 * An implementation of Strings for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var String = [];
String.type = "string";

exports.new_string = function(string) {
	var result = Object.create(String);
	// TODO : do this right .. how?
	result.value = new Function('return ' + string + ';')();
	return result;
}