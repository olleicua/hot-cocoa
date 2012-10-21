/* Tests
 */

var number = require('../number.js');

var tests = [
	[ number.new("1").equivalent( number.new(1) ),
	  true ],
	[ number.new("0").bool().bare(),
	  false ],
	[ number.new("0.0").bare(),
	  0 ]
];

require('../../../../test.js').test(tests);
