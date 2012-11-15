(define reduce
  (lambda (operator _list)
	(if (< (length _list) 1) #f ; this isn't particularly helpful
		(if (< (length _list) 2) (car _list)
			(operator (car _list) (reduce operator (cdr _list)))))))

(define evaluated-if
  (lambda (condition yes no)
	(if (condition yes no) yes no)))

(define fizzbuzz
  (lambda (n)
	(format #t "~a\n"
			(evaluated-if
			 (lambda (number words) (= 0 (string-length words))) n
			 (reduce string-append
					 (map (lambda (pair)
							(if (= 0 (modulo n (car pair))) (cdr pair) ""))
						  '((3 . "Fizz") (5 . "Buzz"))))))
	(if (< n 100) (fizzbuzz (1+ n)))))

(fizzbuzz 1)