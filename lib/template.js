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

var _ = require('underscore');
var fs = require('fs');

var format = function(format_string, values) {
  var index = 0;
  // TODO: add escape mechanism
  return format_string.replace(/~([a-zA-Z0-9_]*)~/g, function(match, key) {
    if (key === '') {
      key = index;
      index++;
    }
    if (values[key] === undefined) {
      return '';
    }
    return values[key];
  })
};

var template_map = function(format_map) {
  var keys = Object.keys(format_map);
  for (var i = 0; i < keys.length; i++) {
    format_map[keys[i]] = { _mapping: format_map[keys[i]] };
  }
  return {
    map: format_map,
    contains: function(key) {
      return this.map[key] !== undefined;
    },
    format: function(key, values, options) {
      var mapping = this.map[key]._mapping;
      if (typeof(mapping) === 'function') {
        return mapping(values, options);
      }
      return format(mapping, values);
    },
    set_synonyms: function(base, others) {
      for (var i = 0; i < others.length; i++) {
        this.map[others[i]] = Object.create(this.map[base]);
        this.map[others[i]].synonymOf = base;
      }
    },
    set_properties: function(key, values) {
      if (typeof(key) === 'string') {
        if (this.map[key] === undefined) {
          throw new Error(format('undefined key: ~~', [key]));
        }
        _.extend(this.map[key], values);
      } else {
        for (var i = 0; i < key.length; i++) {
          this.set_properties(key[i], values);
        }
      }
    }
  };
};

var load = function(path, values) {
  return format(fs.readFileSync(path).toString(), values);
}

exports.format = format;
exports.template_map = template_map;
exports.load = load;