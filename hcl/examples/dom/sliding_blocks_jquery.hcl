;;; This script renders and defines the behavior of a sliding block puzzle
;;; that can run in a browser using JQuery.
;;;
;;; Sam Auciello | Sep 2012

;; CONSTANTS

(def IMG_PATH "dancers.png")
(def IMG_SIZE 600)
(def GRID_SIZE 3)
(def CELL_SIZE (/ IMG_SIZE GRID_SIZE))

;; VARIABLES

;; the row and column of the empty cell
(def empty {x 0 y 0} )

;; FUNCTIONS

;; determine the id of a cell at a given coordinate
(def get_cell
     (# (x y) ($ (cat "#cell_" x "_" y))))

;; deterine whether the block at the given coordinate can be moved
(def movable
     (# (x y) (or (and (= x empty.x) (= y (1- empty.y)))
                  (and (= x empty.x) (= y (1+ empty.y)))
                  (and (= x (1- empty.x)) (= y empty.y))
                  (and (= x (1+ empty.x)) (= y empty.y)))))
    
;; initialize the cell at the given coordinate
(def init_cell
     (# (x y)
        (let (cell (get_cell x y))
          
          ;; set the cell's initial style properties
          (cell.css { width (cat CELL_SIZE "px")
                      height (cat CELL_SIZE "px") } )
        
          ;; non empty properties
          (when (not (and (= empty.x x) (= empty.y y)))
            (cell.css { border "1px solid #000"
                        background-image (cat "url(" IMG_PATH ")")
                        background-position (cat "-" (* x CELL_SIZE) "px "
                                                 "-" (* y CELL_SIZE) "px") } ))
          
          ;; set a click listener
          (cell.click (# ()
               (when (movable x y)
                 (let (empty_cell (get_cell empty.x empty.y))
                   
                   ;; make the empty cell look like the clicked cell
                   (empty_cell.css
                      { background-image (cat "url(" IMG_PATH ")")
                        ; accessible via closure
                        background-position (cell.css "background-position")
                        border "1px solid #000" } )
                   
                   ;; make the clicked cell empty
                   (cell.css { background-image "none"
                               border "none" } )
                   (set empty 'x x)
                   (set empty 'y y))))))))

;; MAIN

;; build grid as an html table
(document.write "<table id=\"puzzle\">")
(each (range GRID_SIZE) (# (y)
     (document.write "<tr>")
     (each (range GRID_SIZE) (# (x)
          (document.write (cat "<td id=\"cell_" x "_" y "\"></td>"))
          (init_cell x y)))
     (document.write "</tr>")))
(document.write "</table>")