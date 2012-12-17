(macro cat (args...)
       `(+ args))

(macro format (format-string args...)
       `(js "format(~~, ~~)" ~format-string ~(args.join ", ")))