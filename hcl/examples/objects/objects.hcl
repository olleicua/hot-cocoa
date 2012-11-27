;; basic object

(def my_object
     { number 10
       add (# (x) (set 'this number (+ x this.number))) } )

(console.log my_object.number) ; 10
(my_object.add 5)
(console.log my_object.number) ; 15
(call add my_object 7)
(console.log my_object.number) ; 22

;; inheritance

(def _Person
     { first_name "N/A"
       last_name "N/A"
       full_name (# () (format "? ?" this.first_name this.last_name))
       shake_hands (# (other) (console.log (format "? shakes hands with ?"
                                                   (this.full_name)
                                                   (other.full_name)))) } )

(def sam (inherit _Person))
(set sam 'first_name "Sam")
(set sam 'last_name "Auciello")

(console.log (get sam "first_name")) ; Sam
(console.log (get sam 'first_name)) ; Sam
(console.log (. sam first_name)) ; Sam
(console.log sam.first_name) ; Sam

(def jim (inherit _Person))
(set jim 'first_name "Jim")
(set jim 'last_name "Mahoney")

(jim.shake_hands sam) ; Jim Mahoney shakes hands with Sam Auciello
(call shake_hands sam jim); // Sam Auciello shakes hands with Jim Mahoney
(apply shake_hands sam '(jim)); // Sam Auciello shakes hands with Jim Mahoney

(def jim_shakes jim.shake_hands)
(jim_shakes sam) ; Jim Mahoney shakes hands with Sam Auciello

(def shakes (get jim 'shake_hands))
(jim_shakes sam) ; Jim Mahoney shakes hands with Sam Auciello