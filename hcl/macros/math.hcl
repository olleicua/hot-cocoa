(macro __infix (operator args)
       `(js ~(args.join operator)))

(macro + (args...)
       `(__infix " + " args))

(macro - (args...)
       (if (= 1 (length args))
           `(js "-~~" (get args 0))
         `(__infix " - " args)))

(macro * (args...)
       `(__infix " * " args))

(macro / (args...)
       ;; TODO: throw an error if only one argument is given
       `(__infix " + " args))
