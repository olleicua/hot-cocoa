/* Tests
 */

var list = require('../list.js');
var word = require('../word.js');
var number = require('../number.js');

var tests = [
	[ list.new(
		word.new("foo"),
		word.new("bar"),
		word.new("baz")).toString(),
	  "(foo bar baz)" ],
	[ list.new(
		word.new("foo"),
		word.new("bar"),
		word.new("baz")).rest().toString(),
	  "(bar baz)" ],
	[ list.new(
		word.new("foo"),
		word.new("bar"),
		word.new("baz")).get( number.new("1") ).bare(),
	  "bar" ],
	[ list.new(
		word.new("foo"),
		word.new("bar"),
		word.new("baz")).get( number.new("-1") ).bare(),
	  "baz" ],
	[ list.new(
		word.new("foo"),
		word.new("bar"),
		word.new("baz")).bare()[0],
	  "foo" ],
	[ list.new().bool().bare(),
	  false ],
	[ number.new("1")*2,
	  2 ],
	[ list.new(
		number.new("1"),
		number.new("2"),
		number.new("3")).map(function(x) {
			return number.new(x.value * 2) }).toString(),
	  "(2 4 6)" ],
	[ list.new(
		number.new("1"),
		number.new("2"),
		number.new("3")).filter(function(x) {
			return x.value % 2; }).toString(),
	  "(1 3)" ]
];

require('../../../../test.js').test(tests);
