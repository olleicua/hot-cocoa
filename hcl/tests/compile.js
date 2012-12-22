/* Tests
 */

var fs = require('fs');
var compile = require('../compile.js');

var tests = [
    [ function() { return compile.compile(
        fs.readFileSync('./hcl/tests/hello.hcl').toString()); },
      fs.readFileSync('./hcl/tests/hello.js.hcl').toString() ],
    [ function() { return compile.compile(
        fs.readFileSync('./hcl/tests/macro.hcl').toString()); },
      fs.readFileSync('./hcl/tests/macro.js.hcl').toString() ],
    [ function() { return compile.compile(
        fs.readFileSync('./hcl/tests/math.hcl').toString()); },
      fs.readFileSync('./hcl/tests/math.js.hcl').toString() ]
];

require('../../tools/test.js').test(tests);
