var reduce = function(operator, list) {
    if (list.length < 1) {
        return false; // this isn't particularly helpful
    }
    if (list.length < 2) {
        return list[0];
    }
    return operator(list[0], reduce(operator, list.slice(1, list.length)));
}

var map = function(operator, list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
        result.push(operator(list[i]));
    }
    return result;
}

var fizzbuzz = function(n) {
    var words = reduce(
        function(a, b) { return a + '' + b; },
        map(
            function(pair) { return (n % pair[0] === 0) ? pair[1] : ''; },
            [[3, "Fizz"], [5, "Buzz"]]
        )
    );
    
    if (words.length > 0) {
        console.log(words);
    } else {
        console.log(n);
    }
    
    if (n < 100) {
        fizzbuzz(n + 1);
    }
}

fizzbuzz(1);