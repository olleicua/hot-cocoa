/* Tests
 */

var fs = require('fs');
var compile = require('../compile.js');

var tests = [
    [ compile.compile(fs.readFileSync('./hcl/tests/hello.hcl').toString()),
      fs.readFileSync('./hcl/tests/hello.js.hcl').toString() ]
];

require('../../tools/test.js').test(tests);
