(macro list (args...)
       `(js "[~~]" ~(args.join ", ")))

;;(macro object (args...)
;;       `(js "{}"
;; TODO: finish this
;; importantly the keys are specified as words but interpretted as strings..
;; this may require a javascript helper for functional iteration..

(macro # (args statements...)
       `(js "function(~~) { ~~ }"
            ~(args.join ", ")
            ~((map compile statements).join "; ")))
;; the return value still needs to be handled here..