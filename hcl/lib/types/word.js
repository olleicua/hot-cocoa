/* Hot Cocoa Lisp
 *
 * An implementation of Words for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var boolean = require('./boolean.js');

var _Word = {};
_Word.type = "word";
_Word.bare = function() { return this.name; };
_Word.toString = function() { return this.name; };
_Word.equivalent = function(other) { return other.name === this.name; };
_Word.bool = function() { return boolean.new(true); };
_Word.copy = function() { return new_word(this.name); };
_Word.eval = function() {
    // TODO: access the current scope
};

var new_word = function(word) {
	var result = Object.create(_Word);
	result.name = word;
	return result;
}

exports.new = new_word;