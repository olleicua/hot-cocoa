/* A tiny demo of the parser backtracking correctly.  With the second set of
 * tokens it gets to the second node of the first expansion of _a before failing
 * and then backtracking to find that it is a valid expansion of _c.
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var parser = require('./parser.js');
var grammar = {
	'_x': [
		['_a'],
		['_c']
	],
	'_a': [
		['type1', 'type2']
	],
	'_c': [
		['type1', 'type3']
	]
}
var tokens1 = [{"type":"type1"}, {"type":"type3"}];
var tree = parser.parse(tokens1, grammar, "_x");
console.log(JSON.stringify(tree));
var tokens2 = [{"type":"type1"}, {"type":"type2"}];
var tree = parser.parse(tokens2, grammar, "_x");
console.log(JSON.stringify(tree));
