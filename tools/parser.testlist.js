exports.tests = function(parser) {
	return [
		
		[function() {
			var tokens = [{"type":"a"}, {"type":"b"}];
			var grammar = {
				"_ab": [
					["a", "b"]
				]
			};
			return parser.parse(tokens, grammar, "_ab");
		},
		 [{type:"_ab", tree:[{type:"a"}, {type:"b"}]}]],

		[function() {
			var tokens = [{"type":"a"}, {"type":"b"}, {"type":"c"}];
			var grammar = {
				"_things": [
					["_abc", "_epsilon", "_epsilon"]
				],
				"_abc": [
					["a", "b", "c"]
				],
				"_epsilon": [
					[]
				]
			};
			return parser.parse(tokens, grammar, "_things");
		},
		 [{type:"_things", tree:[
			 {type:"_abc", tree:[
				 {type:"a"}, {type:"b"}, {type:"c"}]},
			 {type:"_epsilon", tree:[]},
			 {type:"_epsilon", tree:[]}]}]],

		[function() {
			var tokens = [{"type":"type1"}, {"type":"type3"}];
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
			};
			return parser.parse(tokens, grammar, "_x");
		},
		 [{type:"_x", tree:[
			 {type:"_c", tree:[
				 {type:"type1"}, {type:"type3"}]}]}]],

		[function() {
			var tokens = [{"type":"1"}];
			var grammar = {
				'_a': [
					['_b']
				],
				'_b': [
					['1']
				]
			};
			return parser.parse(tokens, grammar, "_a");
		},
		 [{type:"_a", tree:[
			 {type:"_b", tree:[
				 {type:"1"}]}]}]],


		// This one fails when the parser goes down the "x is [1 2 3]"
		// path, but then when it fails to apply the _a rule,
		// it doesn't back out properly to try _x as [1 2]. - Jim
		[function() {
			var tokens = [{"type":"1"}, {"type":"2"}];
			var grammar = {
				'_a': [
					['_x', '_y']
				],
				'_x': [
					['1', '2'],
					['1']
				],
				'_y': [
					['2']
				]
			};
			return parser.parse(tokens, grammar, "_a");
		},
		 [{type:"_a", tree:[
			 {type:"_x", tree:[
				 {type:"1"}]},
			 {type:"_y", tree:[
				 {type:"2"}]}]}]]];
};
