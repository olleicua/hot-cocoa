;; This example has been translated from 
;; http://cs.marlboro.edu/courses/fall2012/web/examples/javascript/example5.js

;; this needs more thought...

((function ()
           
           ;; CONSTANTS
           
           (setq IMG_PATH "dancers.png")
           (setq IMG_SIZE 600)
           (setq GRID_SIZE 3)
           (setq CELL_SIZE (/ IMG_SIZE GRID_SIZE))
           
           ;; VARIABLES
           
           ;; the row and column of the empty cell
           (setq empty_x 0)
           (setq empty_y 0)
           
           ;; FUNCTIONS
           
           ;; determine the id of a cell at a given coordinate
           (setq cell_id (function (x y) (cat "cell_" x "_" y)))
           
           ;; deterine whether the block at the given coordinate can be moved
           (setq movable
                 (function (x y)
                           (or (and (= x empty_x) (= y (- empty_y 1)))
                               (and (= x empty_x) (= y (+ empty_y 1)))
                               (and (= x (- empty_x 1)) (= y empty_y))
                               (and (= x (+ empty_x 1)) (= y empty_y)))))
           
           ;; initialize the cell at the given coordinate
           (setq init_cell
                 (function (x y)
                           (let ((cell
                                  (document.getElementById (cell_id x y))))
                             
                             ;; set the cell's initial style properties
                             (set cell.style.width (cat CELL_SIZE "px"))
                             (set cell.style.height (cat CELL_SIZE "px"))
                             (when (not (and (= empty_x x) (= empty_y y)))
                               (set cell.style.border "1px solid #000")
                               (set cell.style.backgroundImage
                                    (cat "url(" IMG_PATH  ")"))
                               (set cell.style.backgroundPosition
                                    (cat "-" (* x CELL_SIZE) "px -"
                                         (* y CELL_SIZE) "px")))
                             
                             ;; set a click listener
                             (cell.addEventListener "click" (function ()
                                 (if (movable x y)
                                     (let ((empty_cell (document.getElementById 
                                                        (cell_id empty_x
                                                                 empty_y))))
                                       ;; make the empty cell
                                       ;; look like the clicked cell
                                       (set empty_cell.style.backgroundImage
                                            (cat "url(" IMG_PATH ")"))
                                       (set empty_cell.style.backgroundPosition
                                            cell.style.backgroundPosition)
                                        ; accessible via closure
                                       (set empty_cell.style.border
                                            "1px solid #000")
                                       
                                       ;; make the clicked cell empty
                                       (set cell.style.backgroundImage "none")
                                       (set cell.style.border "none")
                                       (setq empty_x x)
                                       (setq empty_y y))))))))
           
           ;; MAIN
           
           ;; build grid as an html table
           (document.write "<table id=\"puzzle\">")
           (each y (range GRID_SIZE)
                 (document.write "<tr>")
                 (each x (range GRID_SIZE)
                       (document.write
                        (cat "<td id=\"" (cell_id x y) "\"></td>"))
                       (init_cell x y))
                 (document.write "</tr>"))
           
           (document.write "</table>")))
