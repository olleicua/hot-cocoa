/* Tests
 */

var json = require('./jsonFull.js');

var tests = [];

var test_inputs = [
    'true',
    '"crazystring"',
    '"this string has escapes in it \\" \\\\ \\\/"',
    '10.34',
    '982e-10',
    '1.2e3',
    '[1,2,3]',
    '{"x":1,"y":[true,false,null]}',
    '[{"a":1,"b":2},{"a":[null,null,null],"b":4.5}]'
];

var anagrams = function(a, b) {
    _a = a.split('');
    _b = b.split('');
    _a.sort();
    _b.sort();
    return _a.join('') === _b.join('');
}

for (var i = 0; i < test_inputs.length; i++) {
    var tokens = json.scan(test_inputs[i]);
    var tree = json.parse(tokens);
    var results = json.analyze(tree);
    tests.push([results[0], (new Function('return ' + test_inputs[i] + ';'))()]);
}

require('../tools/test.js').test(tests);
