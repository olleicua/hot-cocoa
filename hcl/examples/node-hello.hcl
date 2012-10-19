; translated from an example at http://howtonode.org/hello-node

; Load the http module to create an http server.
(set http (require "http"))

; Configure our HTTP server to respond with Hello World to all requests.
(set server (http.createServer
	     (# (request response)
		((. response writeHead) 200 {"Content-Type" "text/plain"})
		((. response end) "Hello World\n"))))

; Listen on port 8000, IP defaults to 127.0.0.1
((. server listen) 8000)

; Put a friendly message on the terminal
((. console log) "Server running at http://127.0.0.1:8000/")