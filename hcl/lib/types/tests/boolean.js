/* Tests
 */

var boolean = require('../boolean.js');

var tests = [
    [ boolean.new('true').bare(),
      true ],
    [ boolean.new('false').equivalent(boolean.new('null')),
      false ]
];

require('../../../../tools/test.js').test(tests);
