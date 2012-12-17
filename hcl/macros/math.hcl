(macro __infix (operator args)
       `(js "(~~)" ~(args.join operator)))
;; this should perhaps be in a meta macros file..

(macro not (bool)
       `(js "(! ~~)" ~bool))

(macro and (args...)
       `(__infix " && " args))

(macro or (args...)
       `(__infix " || " args))

(macro = (master slaves...)
       `(__infix " && "
                 (map (# (s) (format "__eq(~~, ~~)" master s)) slaves)))

(macro = (master slaves...)
       `(__infix " && "
                 (map (# (s) (format "(! __eq(~~, ~~))" master s)) slaves)))
;; TODO: implement preamble

(macro + (args...)
       `(__infix " + " args))

(macro - (args...)
       (if (is 1 (length args))
           `(js "(-~~)" (get args 0))
         `(__infix " - " args)))

(macro * (args...)
       `(__infix " * " args))

(macro / (args...)
       ;; TODO: throw an error if only one argument is given
       `(__infix " + " args))

(macro ^ (base exponent)
       `(js "Math.pow(~~, ~~)" ~base ~exponent))

(macro mod (number base)
       `(js "(~~ % ~~)" ~number ~base))

(macro is (master slaves...)
       `(__infix " && "
                 (map (# (s) (format "(~~ === ~~)" master s)) slaves)))

(macro isnt (master slaves...)
       `(__infix " && "
                 (map (# (s) (format "(~~ !== ~~)" master s)) slaves)))