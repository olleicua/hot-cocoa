/* View this example in action at
 * http://cs.marlboro.edu/courses/fall2012/web/examples/javascript/example5.html
 *
 * This script renders and defines the behavior of a sliding block puzzle
 * that can run in a browser.
 *
 * Sam Auciello | Sep 2012
 */

(function() {
    
    // CONSTANTS
    
    var IMG_PATH = 'dancers.png';
    var IMG_SIZE = 600;
    var GRID_SIZE = 3;
    var CELL_SIZE = IMG_SIZE / GRID_SIZE;
    
    // VARIABLES
    
    // the row and column of the empty cell
    var empty = {x: 0, y: 0}
    
    // FUNCTIONS
    
    // determine the id of a cell at a given coordinate
    var cell_id = function(x, y) { 
        return 'cell_' + x + '_' + y;
    }
    
    // deterine whether the block at the given coordinate can be moved
    var movable = function(x, y) {
        return ((x === empty.x && y === empty.y - 1) ||
                (x === empty.x && y === empty.y + 1) ||
                (x === empty.x - 1 && y === empty.y) ||
                (x === empty.x + 1 && y === empty.y));
    }
    
    // initialize the cell at the given coordinate
    var init_cell = function(x, y) {
        var cell = document.getElementById(cell_id(x, y));
        
        // set the cell's initial style properties
        cell.style.width = CELL_SIZE + 'px';
        cell.style.height = CELL_SIZE + 'px';
        
        // non empty properties
        if (! (empty.x === x && empty.y === y)) {
            cell.style.border = '1px solid #000';
            cell.style.backgroundImage = 'url(' + IMG_PATH + ')';
            cell.style.backgroundPosition = 
                '-' + (x * CELL_SIZE) + 'px -' + (y * CELL_SIZE) + 'px';
        }
        
        // set a click listener
        cell.addEventListener('click', function() {
            if (movable(x, y)) {
                var empty_cell = document.getElementById(
                    cell_id(empty.x, empty.y));
                
                // make the empty cell look like the clicked cell
                empty_cell.style.backgroundImage = 'url(' + IMG_PATH + ')';
                empty_cell.style.backgroundPosition =
                    cell.style.backgroundPosition; // accessible via closure
                empty_cell.style.border = '1px solid #000';
                
                // make the clicked cell empty
                cell.style.backgroundImage = 'none';
                cell.style.border = 'none';
                empty.x = x;
                empty.y = y;
            }
        });
    }
    
    // MAIN
    
    // build grid as an html table
    document.write('<table id="puzzle">');
    for (var y = 0; y < GRID_SIZE; y++) {
        document.write('<tr>');
        for (var x = 0; x < GRID_SIZE; x++) {
            document.write('<td id="' + cell_id(x, y) + '"></td>');
            init_cell(x, y);
        }
        document.write('</tr>');
    }
    document.write('</table>');
})();
