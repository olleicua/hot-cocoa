(def divisible (# (n m) (= 0 (mod n m))))

(def evaluated-if
     (# (condition yes no)
        (if (condition yes no) yes no)))

(def fizzbuzz
     (# (n)
        (console.log
         (evaluated-if (# (number words) (empty? words)) n
                       (reduce cat
                               (map (# (pair)
                                       (if (divisible n (nth 1 pair))
                                           (nth 2 pair) ""))
                                    [[3 "Fizz"] [5 "Buzz"]]))))
        (if (< n 100) (fizzbuzz (+ 1 n)))))

(fizzbuzz 1)
