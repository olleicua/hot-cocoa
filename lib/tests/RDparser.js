/* Tests
 */

var parser = require('../RDparser.js');
var tests = require('./parser.testlist').tests(parser);
require('../test.js').test(tests);
