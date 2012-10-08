/* Hot Cocoa Lisp
 *
 * A test of the evaluation procedure for HCL
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var hcl = require('./hclParser.js');
var eval = require('./lib/eval.js');

var hello = '(console.log "Hello Wordl!") \
             (console.log 17 (parseFloat "1.0"))';
var lists = hcl.analyze(hcl.parse(hcl.scan(hello)));
for (var i = 0; i < lists.length; i++) {
	eval.eval(lists[i]);
}