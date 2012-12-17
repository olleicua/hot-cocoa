(macro def (name value)
       `(js "var ~~ = ~~" ~name ~value))

;;(macro let (vars statements)
;;       `(js "(function(~~) { ~~ })(~~)"
;; this may need to be implememented at the top..
