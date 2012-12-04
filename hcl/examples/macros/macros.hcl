;; an if statement that prints to the log whenever the condition is false
(macro logged-if (condition yes no)
       `(if ~condition ~yes
          (begin (console.log (format "? is false" (quote ~condition)))
                 ~no)))

(def message (logged-if (= 0 x) "x is zero" "x is not zero"))
;; compiles to:
;;
;; var message = (0 === x) ?
;;   "x is zero" :
;;   (console.log(format("? is false", ["=", 0, "x"])),
;;    "x is not zero");
