/* Tests
 */

var object = require('../object.js');
var word = require('../word.js');
var number = require('../number.js');

var tests = [
    [ object.new(
        word.new("foo"), number.new("1"),
        word.new("bar"), number.new("2")).string(),
      "{foo 1 bar 2}" ],
    [ object.new(
        word.new("foo"), number.new("1"),
        word.new("bar"), number.new("2")).bare(),
      {"foo":1, "bar":2} ],
    [ object.new(
        word.new("foo"), number.new("1"),
        word.new("bar"), number.new("2")).get( word.new("foo") ).bare(),
      1 ],
    [ object.new(
        word.new("foo"), number.new("1"),
        word.new("bar"), number.new("2")).bare()[ "foo" ],
      1 ],
    [ object.new( word.new("baz"), number.new("10") ).equivalent(
        object.new( word.new("baz"), number.new("10") ) ),
      true ],
    [ object.new( word.new("baz"), number.new("10") ).equivalent(
        object.new( word.new("baz"), number.new("9") ) ),
      false ],
    [ object.new().bool().bare(),
      false ]
];

require('../../../../tools/test.js').test(tests);
