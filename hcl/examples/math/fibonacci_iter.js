var fibonacci = function(n) {
    var result = [0, 1];
    for (var i = 0; i < n - 2; i++) {
        result.push(result[result.length - 1] + result[result.length - 2]);
    }
    return result;
}

console.log(fibonacci(10));