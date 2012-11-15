var fibonacci = function(n) {
    if (n < 3) {
	return [0, 1];
    }
    var head = fibonacci(n - 1);
    head.push(head[n - 2] + head[n - 3]);
    return head;
}

console.log(fibonacci(10));