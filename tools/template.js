/* Templating in Javascript
 * 
 * A simple templating engine for javascript.  The format function takes a
 * format string and a values object/array.  Values are interpolated into the
 * format string in place of '~TAGNAME~' where 'TAGNAME' is a key in the values
 * object.  If no key is specified (i.e. '~~') then the key is the integer
 * number of empty interpolations preceding this one.
 * 
 * Example Usage:
 *   var template = require('./template.js');
 *   var text = template.format("Position (x, y): (~~, ~~)", [4, 5]);
 *   // "Position (x, y): (4, 5)"
 *   var text = template.format("My name is ~name~ and I am ~age~ years old",
 *                              {name: "Sam", age: 23});
 *   // "My name is Sam and I am 23 years old"
 * 
 * template.load works as template.format except that it interprets its first
 * argument as a path to a file containing a format string instead of the format
 * string itself.
 * 
 * Sam Auciello | September 2012 
 * http://opensource.org/licenses/mit-license.php
 */

var fs = require('fs');

var format = function(format_string, values) {
    var index = 0;
    return format_string.replace(/~([a-zA-Z0-9_]*)~/g, function(_, key) {
        if (key === '') {
            key = index;
            index++;
        }
        return values[key];
    })
};

var load = function(path, values) {
    return format(fs.readFileSync(path).toString(), values);
}

exports.format = format;
exports.load = load;