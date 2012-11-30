/* Tests
 */

var template = require('./template.js');

var tests = [
    [template.format("Position (x, y): (~~, ~~)", [4, 5]),
     "Position (x, y): (4, 5)"],
    [template.format("this ~ text ~ has ~ ~~s ~ in ~~ it!", ['tilda', '~']),
     "this ~ text ~ has ~ tildas ~ in ~ it!"],
    [template.format("He~l~~l~o Wor~l~d!", {l: 'l'}),
     "Hello World!"],
    [template.format("My name is ~name~, I am ~age~ years old",
                           {name: "Sam", age: 23}),
     "My name is Sam, I am 23 years old"],
    [template.load("tools/testTemplate", {condition: "publish", yes: "prosper", no:"perish"}),
     "if (publish) prosper\nelse perish"]
];

require('../tools/test.js').test(tests);
