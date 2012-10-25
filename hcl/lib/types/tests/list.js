/* Tests
 */

var list = require('../list.js');
var word = require('../word.js');
var number = require('../number.js');

var tests = [
    [ list.new().string(),
      "()" ],
    [ list.new(
        word.new("foo"),
        word.new("bar"),
        word.new("baz")).string(),
      "(foo bar baz)" ],
    [ list.new(
        word.new("foo"),
        word.new("bar"),
        word.new("baz")).rest().string(),
      "(bar baz)" ],
    [ list.new(
        word.new("foo"),
        word.new("bar"),
        word.new("baz")).rest().bare(),
      ["bar", "baz"] ],
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
    [ list.new(
        number.new("1"),
        number.new("2"),
        number.new("3")).map(function(x) {
            return number.new(x.value * 2) }).string(),
      "(2 4 6)" ],
    [ list.new(
        number.new("1"),
        number.new("2"),
        number.new("3")).filter(function(x) {
            return x.value % 2; }).string(),
      "(1 3)" ]
];

require('../../../../tools/test.js').test(tests);
