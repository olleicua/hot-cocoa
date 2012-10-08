(each number
	  (map (function (x)
					 (let (three (= 0 (mod x 3))
						   five (= 0 (mod x 5)))
					   (cond
						((and three five) "FizzBuzz\n")
						(three "Fizz\n")
						(five "Buzz\n")
						(t (cat x "\n")))))
		   (range 100))
	  (process.stdout.write number))