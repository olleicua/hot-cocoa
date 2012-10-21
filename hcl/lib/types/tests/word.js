/* Tests
 */

var word = require('../word.js');

var tests = [
	[ word.new("foo").equivalent( word.new("bar") ),
	  false ]
];

require('../../../../test.js').test(tests);
