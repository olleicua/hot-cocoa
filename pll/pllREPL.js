var pll = require('./plltools/parser.js');
var stdin = process.openStdin();
process.stdout.write(' > ');
stdin.on('data', function(text) {
    try {
        pll.analyze(pll.parse(pll.scan(text.toString())));
    } catch(e) {
        console.log(e);
    }
    process.stdout.write(' > ');
});
