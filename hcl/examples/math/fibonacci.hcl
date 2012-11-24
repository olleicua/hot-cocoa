(def fibonacci
     (# (n)
         (if (< n 3) [0 1]
            (let (head (fibonacci (1- n)))
              (push head
                    (+ (nth head -1)
                       (nth head -2)))))))

((. console log) (fibonacci 10)) ; [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
