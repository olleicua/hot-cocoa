;; Taken from http://jqueryui.com/slider/#multiple-vertical

((. ($ "#master") slider) { value 60
                            orientation "horizontal"
                            range "min"
                            animate true } )
;; OR ??

(($ "#master").slider { value 60
                        orientation "horizontal"
                        range "min"
                        animate true } )

(def foo.bar (lambda () (print "Hi")))

