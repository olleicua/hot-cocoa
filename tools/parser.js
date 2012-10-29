/* Parser in Javascript
 * 
 * This is a simple recursive descent parser using an abstract JSON grammar
 * notation of my own design.  The grammar consists of an object relating a
 * non-terminal to an array of arrays of strings.  Each of the inner arrays
 * represents one of the possible expansions of the non-terminal and consists of
 * both non-terminals and terminals.  The non-terminals are distinguished only
 * by their inclusion as keys in the grammar.
 * 
 * The scanner should generate an array of token objects.  Each token object
 * must have a "type" property which will be used in the grammar, and may
 * optionally also have a text property specifying the text of the token as well
 * as a position token specifying the position of the token in the text for
 * debugging purposes.
 * 
 * The parser operates on the scanned array of tokens in place replacing it
 * with the parse tree.
 * 
 * Example Usage:
 *   var parser = require('./parser.js');
 *   var tokens = [{"type":"a"}, {"type":"b"}];
 *   var grammar = {
 *       "_ab": [
 *              ["a", "b"]
 *       ]
 *   };
 *   var tree = parser.parse(tokens, grammar, "_ab");
 * 
 * The above generates the parse tree:
 *   [{type:"_ab", tree:[
 *       {type:"a"},
 *       {type:"b"}
 *   ]}]
 * 
 * Sam Auciello | September 2012 
 * http://opensource.org/licenses/mit-license.php
 */

exports.parse = function(tokens, grammar, start_node) {
	
	var guess = function(guess_node, position) {
		var expansions = grammar[guess_node];
		var current_token = tokens[position];
		if (current_token && current_token.type === guess_node) {
			return [current_token, 1];
		}
		if (expansions === undefined) {
			return false;
		}
		var result_node = {type:guess_node};
		for (var i = 0; i < expansions.length; i++) {
			var possibility = expansions[i];
			var offset = 0;
			result_node.tree = [];
			for (var j = 0; j < possibility.length; j++) {
				var node = possibility[j];
				var parse_result = guess(node, position + offset);
				if (! parse_result) {
					break;
				}
				result_node.tree.push(parse_result[0]);
				offset += parse_result[1];
			}
			if (result_node.tree.length === possibility.length) {
				return [result_node, offset];
			}
		}
		return false;
	}

    var result = guess(start_node, 0);
    if (result) {
        if (result[1] === tokens.length) {
            return [result[0]];
        } else {
            throw 'unexpected token of type ' + tokens[result[1]].type +
                ': ' + tokens[result[1]].text + ' at position ' +
                tokens[result[1]].position ;
        }
    } else {
        throw 'parse error';
    }
}
