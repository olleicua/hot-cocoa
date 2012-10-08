/* Hot Cocoa Lisp
 *
 * An implementation of Words for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var Word = [];
Word.type = "word";

exports.new_word = function(word) {
	var result = Object.create(Word);
	result.name = word;
	return result;
}