// choose w/o memoize
var choose = function(m, n) {
    if (n === 0 || n === m) {
        return 1;
    }
    return choose(m - 1, n) + choose(m - 1, n - 1);
};

// memoize
var memoize = function(func) {

    // make array from arguments object
    var obj_to_array = function(obj) {
        var result = [];
        for (var i = 0; i < obj.length; i++) {
            result.push(obj[i]);
        }
        return result;
    };
    
    var memo = {};
    return function() {
        var args = obj_to_array(arguments);
        var json = JSON.stringify(args);
        if (undefined !== memo[json]) {
            return memo[json];
        }
        var result = func.apply(this, args);
        memo[json] = result;
        return result;
    };
};

// choose w/ memoize
var choose_memo = memoize(function(m, n) {
    if (n === 0 || n === m) {
        return 1;
    }
    return choose_memo(m - 1, n) + choose_memo(m - 1, n - 1);
});

exports.choose = choose;
exports.choose_memo = choose_memo;