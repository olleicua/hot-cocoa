/* Hot Cocoa Lisp
 *
 * An implementation of Eval for Hot Cocoa Lisp in Javascript
 * 
 * Sam Auciello | October 2012
 * http://opensource.org/licenses/mit-license.php
 */

exports.eval = function evaluate(expression) {
	switch (expression.type) {
	case 'list' :
		var func = expression.first();
		var args = expression.rest();
		switch (func.type) {
		case 'word' :
			var passable_args = args.map(function(x) {
				return evaluate(x);
			}).toArray();
			return evaluate(func).apply(undefined, passable_args);
		break;
		case 'list' :
			// TODO : this is wrong
			// this should be differentiated by quote..? think more here..
			// also macros should be differenciated here
			// ... quote is just a macro..
			return func[args.get(0)];
			break;
		case 'object' :
			return func[args.get(0)];
			break;
		default :
		// TODO : errors
			break ;
		}
		break;
	case 'string' :
		return expression.value;
		break;
	case 'number' :
		return expression.value;
		break;
	case 'word' :
		// TODO : eval is probably wrong .. ask Crockford??
		// this could come from 3 places: javascript built-ins HCL built-ins and
		// user defined variables.  Do I want separate syntaxes how should I do
		// this..?  Also dot notation should be more correct..
		return eval(expression.name);
		break;
	}
}