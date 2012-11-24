(define fibonacci
  (lambda (n)
    (if (< n 3) '(0 1)
    (let ((head (fibonacci (1- n))))
      (append head
          (list (+ (list-ref head (- n 2))
               (list-ref head (- n 3)))))))))

(format #t "~a\n" (fibonacci 10))