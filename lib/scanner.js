/* Scanner in Javascript
 * 
 * This is a simple Regexp based scanner that converts strings into arrays of
 * token objects each of wich have a type property, a text property with the
 * original text and a position property with the position within the text the
 * token began at.
 * 
 * The provided array of token types should contain objects of the form:
 *   { t:TYPE, re:REGEXP }
 * Where TYPE is a string denoting the name of the token type to be used later
 * by the parser and REGEXP is a JavaScript regexp beginning with '^' that
 * describes the class of strings that should be called this token.  The order
 * of the token types may matter as the scanner will choose the first matching
 * type.
 *
 * The optional third argument to the scan function is retains whitespace.
 * Unless it is set to a truthy value, any tokens of the type 'whitespace' will
 * be removed from the final result.
 *
 * Example Usage:
 *   var scanner = require('./tools/scanner.js');
 *   var tokenTypes = [
 *       { t:'variable', re:/[a-zA-Z_][a-zA-Z0-9_]*-/ }, // the last hyphen here
 *       { t:',', re:/^,/ },                        // is to stop the multi-line
 *       { t:'whitespace', re:/\s*-/ }              // comment from ending
 *   ];
 *   var tokens = scanner.scan(tokenTypes, "abc, def, fooB0 ");
 * 
 * The above generates the tokens:
 *   [
 *       {type:"variable", text:"abc", position:0},
 *       {type:",", text:",", position:3},
 *       {type:"variable", text:"def", position:5},
 *       {type:",", text:",", position:8},
 *       {type:"variable", text:"fooB0", position:10}
 *   ]
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var firstMatch = function(tokenTypes, text, position) {
    for (var i = 0; i < tokenTypes.length; i++) {
        var match = tokenTypes[i].re.exec(text);
        if (match) {
            return { type:tokenTypes[i].t, text:match[0], position:position };
        }
    }
    throw 'unrecognizable token at ' + position.join(':');
}

exports.scan = function(tokenTypes, text) {
    var tokenList = [];
    var pointer = 0;
    var line = 1;
    var column = 0;
    while (pointer < text.length) {
      var match = firstMatch(tokenTypes, text.substring(pointer), {
        line: line,
        column: column,
        absolute: pointer,
        toString: function() {
          return this.line + ':' + this.column;
        }
      });
      if (match.type !== 'whitespace' && match.type !== 'comment') {
        tokenList.push(match);
      }
        pointer += match.text.length;
        line += (match.text.match(/\n/g) || []).length;
        column += match.text.length;
        if (match.text.match(/\n/)) {
            column = match.text.match(/\n([^\n]*)$/)[1].length
        }
    }
    return tokenList;
};
