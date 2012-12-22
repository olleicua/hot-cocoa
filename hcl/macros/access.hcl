(macro length (object)
       `(js "~~.length" ~object))

;;(macro . (object keys...)
;;       `(js "~~.~~" ~object ~(keys.join ".")))
;; FIXME: this requires bootstrapping..
;; perhaps I should simply make a.b.c parse to (. (. a b) c)

(macro . (object key)
       `(js "~~.~~" ~object ~key))

(macro get (object key)
       `(js "~~[~~]" ~object ~key))

(macro set (object key value)
       `(js "~~[~~] = ~~" ~object ~key ~value))

;; FIXME:
;; the above need to better account for keys that can be words, numbers,
;; or strings
;; .. or do they?

(macro first (list)
       `(js "~~[0]" ~list))

(macro car (list)
       `(first ~list))

(macro rest (list)
       `(js "~~.slice(1)" ~list))

(macro cdr (list)
       `(rest ~list))