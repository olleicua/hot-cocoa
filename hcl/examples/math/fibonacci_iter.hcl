(def fibonacci
     (# (n)
        (let (result [0 1])
          (each (range 1 n)
                (push! result (+ (nth result -1)
                				 (nth result -2))))
		  result)))

(console.log (fibonacci 10))
