(macro list (args...)
       `(js "[~~]" ~(args.join ", ")))

;;(macro object (args statements...)
;;       `(js "{}"
;; TODO: finish this
            
(macro # (args statements...)
       `(js "function(~~) { ~~ }"
            ~(args.join ", ")
            ~((map compile statements).join "; ")))
;; the return value still needs to be handled here..