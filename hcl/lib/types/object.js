/* Hot Cocoa Lisp
 *
 * A wrapper implementation for Objects in Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

var boolean = require('./boolean.js');

var _Object = {};
_Object.type = "object";
_Object.bare = function() {
    var result = {};
    for (var i = 0; i < this.keys.length; i++) {
        result[this.keys[i]] = this.get(this.keys[i]).bare();
    }
    return result;
};
_Object.string = function() {
    var pairs = [];
    for (var i = 0; i < this.keys.length; i++) {
        pairs.push(this.keys[i] + " " + this.get(this.keys[i]).string());
    }
    return "{" + pairs.join(" ") + "}";
};
_Object.equivalent = function(other) {
    if (this.keys.length !== other.keys.length) {
        return false;
    }
    for (var i = 0; i < this.keys.length; i++) {
        if (other.keys.indexOf(this.keys[i]) === -1) {
            return false;
        }
        if (! this.get(this.keys[i]).equivalent(other.get(this.keys[i]))) {
            return false;
        }
    }
    return true;
};
_Object.bool = function() { return boolean.new(this.keys.length !== 0); };
_Object.eval = function() { return this; };
_Object.get = function(key) {
    return this.object[key.string ? key.string() : key];
};
_Object.set = function(key, value) {
    if (typeof(key) === 'string') {
    var _key = key;
    } else {
    var _key = key.string();
    }
    this.object[_key] = value;
    if (this.keys.indexOf(_key) === -1) {
        this.keys.push(_key);
    }
    return value;
};
_Object.copy = function() {
    var result = new_object();
    for (var i = 0; i < this.keys.length; i++) {
        result.keys.push(this.keys[i]);
        result.object[this.keys[i]] = this.object[this.keys[i]].copy();
    }
    return result;
};

var new_object = function() {
    var result = Object.create(_Object);
    result.object = {};
    result.keys = [];
    for (var i = 1; i < arguments.length; i += 2) {
        result.keys.push(arguments[i - 1].string());
        result.object[arguments[i - 1].string()] = arguments[i];
    }
    return result;
};

exports.new = new_object;
