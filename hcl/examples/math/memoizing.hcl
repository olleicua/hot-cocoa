;; choose w/o memoize
(def choose
     (# (m n)
        (if (or (= 0 n) (= m n)) 1
          (+ (choose (1- m) n)
             (choose (1- m) (1- n))))))

;; memoize
(def (memoize func)
     (let (memo {})
       (# args
          (let (json (JSON.stringify args))
            (or (get memo json)
                (set memo json (apply func args)))))))

;; choose w/ memoize
(def choose_memo
     (memoize (# (m n)
                 (if (or (= 0 n) (= m n)) 1
                   (+ (choose_memo (1- m) n)
                      (choose_memo (1- m) (1- n)))))))
