/* Semantic analyzer in Javascript
 * 
 * A simple system for applying attribute grammars to previously generated parse
 * tree.
 *
 * TODO: document this better
 * 
 * Example Usage:
 *   var analyzer = require('./tools/analyzer.js');
 *   var tree =  [{type:"_sum-pair", tree:[
 *       {type:"_sum", tree:[
 *           {type:"number", text:"1"},
 *           {type:"+"},
 *           {type:"number", text:"2"}
 *       ]},
 *       {type:"_sum", tree:[
 *           {type:"number", text:"3"},
 *           {type:"+"},
 *           {type:"number", text:"3"}
 *       ]}
 *   ]}];
 *   var grammar = analyzer.analyzer({
 *       "_sum-pair": function(tree) {
 *           first_sum = this.analyze(tree[0]);
 *           second_sum = this.analyze(tree[1]);
 *           return [first_sum, second_sum];
 *       },
 *       "_sum": function(tree) {
 *           first_number = parseInt(tree[0].text);
 *           second_number = parseInt(tree[2].text);
 *           return first_number + second_number;
 *       }
 *   });
 *   var result = grammar.apply(tree);
 * 
 * The above generates the parse result:
 *   [[3, 6]]
 * 
 * Sam Auciello | September 2012 
 * http://opensource.org/licenses/mit-license.php
 */

exports.analyzer = function(grammar) {
	
	// process the tree below the passed node using the method from the grammar
	// corresponding to the node's type.
    grammar.analyze = function(node, args) {
        if (node.tree !== undefined) {
            return this[node.type](node.tree, args);
        }
        return this[node.type](node, args);
    };
	
	// process each node of the tree and return the result
    grammar.apply = function(tree) {
        var results = [];
        for (var i = 0; i < tree.length; i++) {
            results.push(this.analyze(tree[i]));
        }
        return results;
    };
    return grammar;
}
