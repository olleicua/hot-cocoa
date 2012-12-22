(macro . (object key)
       `(js "~~.~~" ~object ~key))

(macro __infix (operator args)
       `(js "(~~)" ~(args.join operator)))

(macro + (args...)
       `(__infix " + " args))

(alert (+ 1 2))