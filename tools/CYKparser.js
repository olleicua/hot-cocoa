/* Parser in Javascript
 * 
 * This is a simple CYK parser using an abstract JSON grammar
 * notation of my own design.  The grammar consists of an object relating a
 * non-terminal to an array of arrays of strings.  Each of the inner arrays
 * represents one of the possible expansions of the non-terminal and consists of
 * both non-terminals and terminals.  The non-terminals are distinguished only
 * by their inclusion as keys in the grammar.
 * 
 * The scanner should generate an array of token objects.  Each token object
 * must have a "type" property which will be used in the grammar, and may
 * optionally also have a text property specifying the text of the token as well
 * as a position token specifying the position of the token in the text for
 * debugging purposes.
 *  
 * Because the grammar needs to be converted internally to Chompsky Normal Form
 * keys beginning with '___key' are reserved and excluded from use in the
 * grammar.
 *
 * Example Usage:
 *   var parser = require('./parser.js');
 *   var tokens = [{"type":"a"}, {"type":"b"}];
 *   var grammar = {
 *       "_ab": [
 *              ["a", "b"]
 *       ]
 *   };
 *   var tree = parser.parse(tokens, grammar, "_ab");
 * 
 * The above generates the parse tree:
 *   [{type:"_ab", tree:[
 *       {type:"a"},
 *       {type:"b"}
 *   ]}]
 * 
 * I recived significant help understanding this algorithm from
 * Peter Schmidt-Nielsen.  Specifically it was his idea to repeat the
 * calculation of the possible expansions of a given interval until no new ones
 * are added so as to allow for expansions of size 0 and 1.  The original
 * formulation of the algorithm requires CNF.  My CNF converter simply ensures
 * that each production has no more than two symbols in it.
 * 
 * Sam Auciello | September 2012 
 * http://opensource.org/licenses/mit-license.php
 */

var CHOMPSKY_PREFIX = '___key'
var PREFIX_PATTERN = new RegExp('^' + CHOMPSKY_PREFIX);

var has_key = function(grammar, func) {
    // checks whether any of the grammar's keys meet the condition func(key)
    var keys = Object.keys(grammar);
    for (var i = 0; i < keys; i++) {
        if (func(keys[i])) {
            return true;
        }
    }
    return false;
}

var to_cnf = function(grammar) {
    // returns an equivalent grammar in Chompsky Normal Form
    // requires that no current non-terminals in the grammar begin with '___key'
    
    if (has_key(grammar, function(key) { return PREFIX_PATTERN.exec(key); })) {
        throw new Error("keys beginning with '" + CHOMPSKY_PREFIX +
                        "' are reserved for internal use");
    }

    var result = {};
    var counter = 0;
    var new_key = function() {
        counter++;
        return CHOMPSKY_PREFIX + counter.toString();
    };
    var keys = Object.keys(grammar);
    for (var i = 0; i < keys.length; i++) { // each non-terminal
        result[keys[i]] = [];
        for (var j = 0; j < grammar[keys[i]].length; j++) { // each expansion
            var expansion = grammar[keys[i]][j];
            if (expansion.length < 3) {
                // this expansions fits CNF add it verbatim
                result[keys[i]].push(expansion);
            } else {
                // break this one up
                var new_expansion = [];
                result[keys[i]].push(new_expansion);
                var next_space = new_expansion;
                for (var k = 0; k < (expansion.length - 2); k++) {
                    next_space[0] = expansion[k];
                    var next_key = new_key();
                    next_space[1] = next_key;
                    result[next_key] = [];
                    next_space = [];
                    result[next_key].push(next_space);
                }
                next_space[0] = expansion[expansion.length - 2];
                next_space[1] = expansion[expansion.length - 1];
            }
        }
    }
    return result;
};
exports.to_cnf = to_cnf;

var collapse_cnf_artifacts = function(parse_tree) {
    // collapses all nodes in the parse_tree that begin with '___key'
    // Example:
    // {type:"_a" tree:[
    //     {type:"b"},
    //     {type:"___key1" tree:[
    //         {type:"c"},
    //         {type:"d"}]}]}
    // becomes
    // {type:"_a" tree:[
    //     {type:"b"},
    //     {type:"c"},
    //     {type:"d"}]}
    var result = {};
    var keys = Object.keys(parse_tree);
    for (var i = 0; i < keys.length; i++) {
        if (parse_tree[keys[i]] !== undefined) {
            result[keys[i]] = parse_tree[keys[i]];
        }
    }
    if (parse_tree.tree) {
        result.tree = [];
        for (var i = 0; i < parse_tree.tree.length; i++) {
            if (PREFIX_PATTERN.exec(parse_tree.tree[i].type)) {
                // this node begins with '___key'
                var collapsed = collapse_cnf_artifacts(parse_tree.tree[i]);
                for (var j = 0; j < collapsed.tree.length; j++) {
                    result.tree.push(collapsed.tree[j]);
                }
            } else {
                // this node doesn't begin with '___key'
                result.tree.push(collapse_cnf_artifacts(parse_tree.tree[i]));
            }
        }
    }
    return result;
}

exports.parse = function(tokens, grammar, start_node) {
    
    var cnf_grammar = to_cnf(grammar);
    
    // a map from (non-terminal, interval) to a valid parsing of that interval
    // as that non-terminal if one exists.
    var parse_table = {};
    
    var try_parse = function(node, position, size) {
        if (parse_table[[node, position, size]]) {
            return parse_table[[node, position, size]];
        } else if (size === 1 && tokens[position].type === node) {
            return tokens[position];
        }
        return false;
    }
    
    for (var size = 0; size <= tokens.length; size++) {
        for (var position = 0; position <= (tokens.length - size); position++) {
            
            // each interval
            
            var changed = true;
            while (changed) {
                changed = false;
                
                // repeat this until nothing changes
                
                for (var i = 0; i < Object.keys(cnf_grammar).length; i++) {
                    var key = Object.keys(cnf_grammar)[i];
                    for (var j = 0; j < cnf_grammar[key].length; j++) {
                        var expansion = cnf_grammar[key][j];

                        // each expansion
                        
                        if (expansion.length === 0) {
                            // add epsilon expansions if size is 0
                            if (size === 0) {
                                if (parse_table[[key, position, size]] ===
                                    undefined) { changed = true; }
                                parse_table[[key, position, size]] =
                                    {type:key, tree:[]};
                            }
                        }
                        if (expansion.length === 1) {
                            // add expansions of size 1 if they expand to something
                            // that fits here or they expand to a token that is here
                            // and size is 1
                            var p;
                            if (p = try_parse(expansion[0], position, size)) {
                                if (parse_table[[key, position, size]] ===
                                    undefined) { changed = true; }
                                parse_table[[key, position, size]] =
                                    {type:key, tree:[p]};
                            }
                        }
                        if (expansion.length === 2) {
                            divisions: for (var divide = 0; divide <= size;
                                            divide++) {
                                // for each division of the subsequence
                                // add them if they expand to something that fits
                                // here or they expand to a token that is here and
                                // the interval size is 1
                                var p1 = try_parse(expansion[0], position, divide);
                                var p2 = try_parse(expansion[1], position + divide,
                                                   size - divide);
                                if (p1 && p2) {
                                    if (parse_table[[key, position, size]] ===
                                        undefined) { changed = true; }
                                    parse_table[[key, position, size]] =
                                        {type:key, tree:[p1, p2]};
                                    break divisions;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    // return parsing
    if (parse_table[[start_node, 0, tokens.length]]) {
        var parse_tree = parse_table[[start_node, 0, tokens.length]];
        return [collapse_cnf_artifacts(parse_tree)];
    } else {
        throw 'parse error';
    }
};
