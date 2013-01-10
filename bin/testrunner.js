#!/usr/bin/env node

var _ = require('underscore');
var fs = require('fs');
var exec = require('child_process').exec;
var format = require('../lib/template.js').format;

var VERBOSE = (process.argv.indexOf('-v') !== -1) ? '-v' : '';

var getChildren = function(dir, file_pattern, dir_pattern) {
	
	// validate directory
	if (! fs.statSync(dir).isDirectory()) {
		throw new Error(format('~~ is not a directory', [dir]));
	}
	
	// look at each file in the directory
	
	return _.flatten(fs.readdirSync(dir).filter(function(f) {
		// omit files starting with '.'
		return ! /^\./.exec(f);
	}).map(function(f) {
		var file = format('~~/~~', [dir, f]);
		
		// recursively add the contents of directories
		
		if (fs.statSync(file).isDirectory()) {
			return getChildren(file, file_pattern, dir_pattern);
		}
		
		// dir matches
		if (dir_pattern && dir_pattern.exec(dir)) {
			return file;
		}
		
		// file matches
		if (file_pattern && file_pattern.exec(f)) {
			return file;
		}
		
		// file doesn't match
		return null;
	}).filter(function(f) {
		return f !== null;
	}));
};

var commands = [];
var files = [];
_.each(getChildren('.', /\.test\./, /\/tests\b/), function(file) {
	if (/\.js$/.exec(file)) {
		commands.push(format('node ~~ ~~', [file, VERBOSE]));
		files.push(file);
	}
});

var total = 0;
var passed = 0;
(function runTests() {
	if (commands.length > 0) {
		exec(commands.shift(), function(error, stdout, stderr) {
			console.log(files.shift());
			console.log(stdout);
			var m = /Passed (\d+) of (\d+) tests\./.exec(stdout);
			total += parseInt(m[1]);
			passed += parseInt(m[2]);
			runTests();
		});
	} else {
		console.log(' ---');
		console.log(format('Passes ~~ of ~~ tests.', [passed, total]));
	}
})();
