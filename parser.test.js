/* Tests
 */

var parser = require('./parser.js');

var tests = [

	[function() {
		var tokens = [{"type":"a"}, {"type":"b"}];
		var grammar = {
			"_ab": [
				["a", "b"]
			]
		};
		var tree = parser.parse(tokens, grammar, "_ab");
		return JSON.stringify(tree);
	},
	 '[{"type":"_ab","tree":[{"type":"a"},{"type":"b"}]}]'],


       // This one fails when the parser goes down the "x is [1 2 3]"
       // path, but then when it fails to apply the _a rule,
       // it doesn't back out properly to try _x as [1 2]. - Jim
	[function() {
		var tokens = [{"type":"1"}, {"type":"2"}, {"type":"3"}];
		var grammar = {
			'_a': [
				['_x', '_y']
			],
			'_x': [
				['1', '2', '3'],
				['1', '2']
			],
			'_y': [
				['3']
			]
		};
		var tree = parser.parse(tokens, grammar, "_ab");
		return JSON.stringify(tree);
	},
	 '[{"type":"_a","tree":[{"type":"_x","tree":[{"type":"1"},{"type":"2"}]},{"type":"_y","tree":[{"type":"3"}]}]}]']];

require('./test.js').test(tests);
