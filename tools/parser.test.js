/* Tests
 */

var parser = require('./parser.js');
var tests = require('./parser.testlist.js').tests(parser);
require('./test.js').test(tests);
