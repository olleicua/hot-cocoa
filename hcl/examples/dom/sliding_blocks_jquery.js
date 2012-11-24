/* This script renders and defines the behavior of a sliding block puzzle
 * that can run in a browser using JQuery.
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
    var get_cell = function(x, y) {
        return $('#cell_' + x + '_' + y);
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
        var cell = get_cell(x, y);
        
        // set the cell's initial style properties
        cell.css({
            'width': CELL_SIZE + 'px',
            'height': CELL_SIZE + 'px'
        });
        
        // non empty properties
        if (! (empty.x === x && empty.y === y)) {
            cell.css({
                'border': '1px solid #000',
                'background-image': 'url(' + IMG_PATH + ')',
                'background-position':
                    '-' + (x * CELL_SIZE) + 'px -' + (y * CELL_SIZE) + 'px'
            });
        }
        
        // set a click listener
        cell.click(function() {
            if (movable(x, y)) {
                var empty_cell = get_cell(empty.x, empty.y);
                
                // make the empty cell look like the clicked cell
                empty_cell.css({
                    'background-image': 'url(' + IMG_PATH + ')',
                     // accessible via closure
                    'background-position': cell.css('background-position'),
                    'border': '1px solid #000'
                });
                
                // make the clicked cell empty
                cell.css({
                    'background-image': 'none',
                    'border': 'none'
                })
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
            document.write('<td id="cell_' + x + '_' + y + '"></td>');
            init_cell(x, y);
        }
        document.write('</tr>');
    }
    document.write('</table>');
})();
