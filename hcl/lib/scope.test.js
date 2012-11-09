/* Tests
 */

var scope = require('./scope.js');
var word = require('./types/word.js');

var tests = [
    //scope.resolve(scope.top, word.new("process")).get("execPath"),
    [scope.resolve(scope.top, word.new("console")).get("log").type,
     'function']
];

require('../../tools/test.js').test(tests);
