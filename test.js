/* A simple Javascript testing system
 */

exports.test = function(tests) {
	var passed = 0;
	for (var i = 0; i < tests.length; i++) {
		if (tests[i][0] === tests[i][1]) {
			passed++;
		} else {
			console.log("Failed test " + i +
						" expecting " + tests[i][1] +
						" got " + tests[i][0] + ".");
		}
	}
	console.log("Passed " + passed + " of " + tests.length + " tests.");
}