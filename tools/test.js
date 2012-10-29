/* A simple Javascript testing system
 */

var equivalent  = function(value1, value2) {
    if (typeof(value1) !== typeof(value2)) {
        return false;
    }
    if (typeof(value1) === 'object' && value1 !== null) {
        var keys1 = Object.keys(value1);
        var keys2 = Object.keys(value2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (var i = 0; i < keys1.length; i++) {
            if (! equivalent(value1[keys1[i]], value2[keys1[i]])) {
                return false;
            }
        }
        return true;
    }
    return value1 === value2;
};

exports.test = function(tests) {
    var passed = 0;
    for (var i = 0; i < tests.length; i++) {
        if (typeof(tests[i][0]) === 'function') {
            try {
                var value1 = tests[i][0]();
            } catch (error) {
				var value1 = error.toString();
            }
        } else {
            var value1 = tests[i][0];
        }
        if (equivalent(value1, tests[i][1])) {
            passed++;
        } else {
            console.log("Failed test " + (i + 1) +
                        " expecting " + JSON.stringify(tests[i][1]) +
                        " got " + JSON.stringify(value1) + ".");
        }
    }
    console.log("Passed " + passed + " of " + tests.length + " tests.");
};
