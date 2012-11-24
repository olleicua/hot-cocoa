;; choose w/o memoize
(define (choose m n)
  (if (or (= 0 n) (= m n)) 1
      (+ (choose (1- m) n)
         (choose (1- m) (1- n)))))

;; memoize
(define (memoize func)
  (let ((memo (make-array #f 10000)) ; only works for integer inputs below 10000
        (hash (lambda (m n) ; map a pair of integers below 100 to a unique hash
                (+ m (* 100 n)))))
    (lambda args
      (let ((hashed-input (apply hash args)))
        (or (array-ref memo hashed-input)
            (let ((result (apply func args)))
              (array-set! memo result hashed-input)
              result))))))

;; choose w/ memoize
(define choose_memo
  (memoize (lambda (m n)
             (if (or (= 0 n) (= m n)) 1
                 (+ (choose_memo (1- m) n)
                    (choose_memo (1- m) (1- n)))))))
