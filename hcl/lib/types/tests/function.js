/* Tests
 */

var func = require('../function.js');

var tests = [
	[ func.new().bool().bare(),
	  true ]
];

require('../../../../test.js').test(tests);
