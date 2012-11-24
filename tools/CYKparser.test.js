/* Tests
 */

var parser = require('./CYKparser.js');
var tests = require('./parser.testlist.js').tests(parser);
tests.push([
    parser.to_cnf({
        '_value': [
            ['_object'],
            ['_array'],
            ['string'],
            ['number'],
            ['atom']
        ],
        '_object': [
            ['{', 'string', ':', '_value', '_object-tail']
        ],
        '_object-tail': [
            [',', 'string', ':', '_value', '_object-tail'],
            ['}']
        ],
        '_array': [
            ['[', '_value', '_array-tail']
        ],
        '_array-tail': [
            [',', '_value', '_array-tail'],
            [']']
        ]
    }),
    {
        "_value": [
            ["_object"],
            ["_array"],
            ["string"],
            ["number"],
            ["atom"]
        ],
        "_object": [
            ["{", "___key1"]
        ],
        "___key1": [
            ["string", "___key2"]
        ],
        "___key2": [
            [":", "___key3"]
        ],
        "___key3": [
            ["_value", "_object-tail"]
        ],
        "_object-tail": [
            [",", "___key4"],
            ["}"]
        ],
        "___key4": [
            ["string", "___key5"]
        ],
        "___key5": [
            [":", "___key6"]
        ],
        "___key6": [
            ["_value", "_object-tail"]
        ],
        "_array": [
            ["[", "___key7"]
        ],
        "___key7": [
            ["_value", "_array-tail"]
        ],
        "_array-tail": [
            [",", "___key8"],
            ["]"]
        ],
        "___key8": [
            ["_value", "_array-tail"]
        ]
    }
]);
require('./test.js').test(tests);
