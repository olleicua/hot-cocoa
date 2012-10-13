/* Hot Cocoa Lisp
 *
 * An implementation of Words for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var _Word = {};
_Word.type = "word";
_String.toString = function() { return this.name; };

exports.new_word = function(word) {
	var result = Object.create(_Word);
	result.name = word;
	return result;
}