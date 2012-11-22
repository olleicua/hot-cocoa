// basic object

var my_object = {
	number: 10,
	add: function(x) { this.number += x; }
};

console.log(my_object.number) // 10
my_object.add(5)
console.log(my_object.number) // 15

// inheritance

var _Person = {
	first_name: 'N/A',
	last_name: 'N/A',
	full_name: function() {
		return this.first_name + ' ' + this.last_name;
	},
	shake_hands: function(other) {
		console.log(this.full_name() + ' shakes hands with ' + other.full_name());
	}
}

var sam = Object.create(_Person);
sam.first_name = "Sam";
sam.last_name = "Auciello";

console.log(sam["first_name"]); // Sam

var jim = Object.create(_Person);
jim.first_name = "Jim";
jim.last_name = "Mahoney";

jim.shake_hands(sam); // Jim Mahoney shakes hands with Sam Auciello
sam.shake_hands(jim); // Sam Auciello shakes hands with Jim Mahoney

var jim_shakes = function(other) { jim.shake_hands.call(jim, other); };
jim_shakes(jim) ; // Jim Mahoney shakes hands with Jim Mahoney

var shakes = jim.shake_hands;
shakes.call(sam, sam); // Sam Auciello shakes hands with Sam Auciello