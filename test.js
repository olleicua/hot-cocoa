/* A simple Javascript testing system
 */

exports.test = function(tests) {
	var passed = 0;
	for (var i = 0; i < tests.length; i++) {
		if (typeof(tests[i][0]) === 'function') {
			try {
				var value1 = tests[i][0]();
			} catch (error) {
				var value1 = error;
			}
		} else {
			var value1 = tests[i][0];
		}
		if (value1 === tests[i][1]) {
			passed++;
		} else {
			console.log("Failed test " + i +
						" expecting " + tests[i][1] +
						" got " + value1 + ".");
		}
	}
	console.log("Passed " + passed + " of " + tests.length + " tests.");
}