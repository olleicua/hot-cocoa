/* Tests
 */

var hcl = require('./hclParser.js');

var string2hcl = function(string) {
    var tokens = hcl.scan(string);
    var tree = hcl.parse(tokens);
    //console.log('\n', JSON.stringify(tokens));
    return hcl.analyze(tree)[0];
};

var tests = [
    [function() {
        return string2hcl('\'()').bare(); },
     ['quote', []]],
    [function() {
        return string2hcl('(a\nb)').bare(); },
     ['a', 'b']],
    [function() {
        return string2hcl('\'(1 2 3)').bare(); },
     ['quote', [1, 2, 3]]],
    [function() {
        return string2hcl('\`(1 2 ~(- 4 1))').bare(); },
     ['quaziquote', [1, 2, ['unquote', ['-', 4, 1]]]]],
    [function() {
        return string2hcl('(+ 1 2)').bare(); },
     ['+', 1, 2]],
    [function() {
        return string2hcl('[]').bare(); },
     ['list']],
    [function() {
        return string2hcl(';; foo\n[]').bare(); },
     ['list']],
    [function() {
        return string2hcl('[1];; bar\n').bare(); },
     ['list', 1]],
    [function() {
        return string2hcl('[1 2 3]').bare(); },
     ['list', 1, 2, 3]],
    [function() {
        return string2hcl('{}').bare(); },
     ['object']],
    [function() {
        return string2hcl('{a 1 b 2}').bare(); },
     ['object', 'a', 1, 'b', 2]],
    [function() {
        return string2hcl('{a [1 2 3] b [{x 4} {x 5} {x 6}]}').bare(); },
     ['object', 'a', ['list', 1, 2, 3], 'b', ['list', ['object', 'x', 4], ['object', 'x', 5], ['object', 'x', 6]]]],
    [function() {
        return string2hcl('foo.bar').bare(); },
     ['.', 'foo', 'bar']],
    [function() {
        return string2hcl('foo.bar.baz').bare(); },
     ['.', 'foo', 'bar', 'baz']],
    [function() {
        return string2hcl('(a b).c.d').bare(); },
     ['.', ['a', 'b'], 'c', 'd']],
    [function() {
        return string2hcl('(console.log "Hello World!")').bare(); },
     [['.', 'console', 'log'], 'Hello World!']],
    [function() {
        return string2hcl('(($ "div#foo").css "background-color" \
                                              "#ffaaaa")').bare(); },
     [[".", ["$", "div#foo"], "css"], "background-color", "#ffaaaa"]],
    [function() {
        return string2hcl('(($ "div#foo").css { background-color "#ffaaaa" \
                                                padding "5em"})').bare(); },
     [[".", ["$", "div#foo"], "css"], ["object", "background-color", "#ffaaaa",
                                                    "padding", "5em"]]],
    [function() {
        return string2hcl('(def empty? (# (l) (= 0 (length l))))').bare(); },
     ['def', 'empty?', ['#', ['l'], ['=', 0, ['length', 'l']]]]],
    [function() {
        return string2hcl('(def empty? (# (l) (if (= 0 (length l)) true false)))').bare(); },
     ['def', 'empty?', ['#', ['l'], ['if', ['=', 0, ['length', 'l']], true, false]]]]
];

require('../tools/test.js').test(tests);
