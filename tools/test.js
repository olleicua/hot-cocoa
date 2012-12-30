/* A simple Javascript testing system
 */

var template = require('./template.js');

// check for -v flag
var VERBOSE = process.argv.indexOf('-v') !== -1;

// an equivalence relation that does full comparison of objects/arrays
var equivalent = function(value1, value2) {
    
    if (typeof(value1) !== typeof(value2)) {
        return false;
    }
    
    if (value1 === value2) {
        return true;
    }
    
    // recursively compare objects and arrays
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
    
    return false;
};

exports.test = function(tests) {
    
    var passed = 0;
    
    for (var i = 0; i < tests.length; i++) {

        var test_value = tests[i][0];
        var expected_value = tests[i][1];
        
        // if test_value is a function, wrap it in a try to isolate and expose
        // any errors without interupting the rest of the tests
        if (typeof(test_value) === 'function') {
            try {
                test_value = test_value();
            } catch (error) {
                test_value = error.toString();
                if (VERBOSE) {
                    console.log(error.stack);
                }
            }
        }
        
        if (equivalent(test_value, expected_value)) {
            passed++;
        } else {
            console.log(template.format("Failed test ~~ expecting ~~ got ~~.",
                                        [i + 1,
                                         JSON.stringify(expected_value),
                                         JSON.stringify(test_value)]));
        }
    }
    
    console.log(template.format("Passed ~~ of ~~ tests.",
                                [passed, tests.length]));
};
