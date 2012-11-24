/* Hot Cocoa Lisp
 *
 * An implementation of scope for Hot Cocoa Lisp
 * 
 * Sam Auciello | November 2012
 * http://opensource.org/licenses/mit-license.php
 */

var foo = 1;

// includes
var func = require('./types/function.js');
var number = require('./types/number.js');
var string = require('./types/string.js');
var boolean = require('./types/boolean.js');
var list = require('./types/list.js');
var object = require('./types/object.js');

// save the global JavaScript namespace
var _JS_GLOBAL_NS = global;

var top_scope = {};

var new_scope = function(parent) {
    if (parent === undefined) {
    return top_scope;
    }
    var result = Object.create(parent);
    return result;
}

var wrap_js = function(js_obj) {
    if (typeof(js_obj) === 'number') {
    return number.new(js_obj);
    }
    if (typeof(js_obj) === 'string') {
    var result = string.new();
    result.value = js_obj;
    return result;
    }
    if (typeof(js_obj) === 'boolean' ||
    js_obj === null || js_obj === undefined) {
    return boolean.new(js_obj);
    }
    if (typeof(js_obj) === 'function') {
    return func.new_from_js(_JS_GLOBAL_NS, js_obj);
    }
    if (Object.prototype.toString.call(js_obj) === '[object Array]') {
    var arr = [];
    for (var i = 0; i < js_obj.length; i++) {
        arr.push(wrap_js(js_obj[i]));
    }
    return list.new.apply(undefined, arr);
    }
    if (typeof(js_obj) === 'object') {
    // TODO: make prototypal enheritance work
    var obj = object.new();
    var keys = Object.keys(js_obj);
    for (var i = 0; i < keys.length; i++) {
        obj.set(keys[i], wrap_js(js_obj[keys[i]]));
    }
    return obj;
    }
    throw new Error("Unexpected JavaScript value of type " +
            typeof(js_obj));
}

var resolve_scope = function(scope, word) {
    if (word.type !== 'word') {
    throw new Error("Attempt to resolve the scope of a non-word");
    }
    if (scope[word.name]) {
    return scope[word.name];
    }
    if (_JS_GLOBAL_NS[word.name]) {
    var result = wrap_js(_JS_GLOBAL_NS[word.name]);
    result.from_js = true;
    return result;
    }
    throw new Error("Unbound word " + word.name);
}

exports.top = top_scope;
exports.new = new_scope;
exports.resolve = resolve_scope;