/* Tests
 */

var func = require('../function.js');

var tests = [
    [ func.new().bool().bare(),
      true ]
];

require('../../../../tools/test.js').test(tests);
