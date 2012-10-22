/* Tests
 */

var number_parser = require('./4.11.2.js');

var tests = [];

var test_inputs = [
    '1.0',
    '2.1234',
    '6345.904'
];

for (var i = 0; i < test_inputs.length; i++) {
    var tokens = number_parser.scan(test_inputs[i]);
    var tree = number_parser.parse(tokens);
    var results = number_parser.analyze(tree);
	tests.push([results[0], parseFloat(test_inputs[i])]);
}

require('../test.js').test(tests);
