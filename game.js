// Initialize phaser scene
var config = {
    type: Phaser.AUTO,
    width: 1024, // Don't touch it!
    height: 768, // DON'T TOUCH IT!
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var vertLineColor = 0xeb4672;       // Vertical line color
var hozLineColor = 0x7546eb;        // Horizontal line color
var dotSize = 15;                   // Radius of dots
var dotColorDefault = 0xeb4672;     // Color of inactive dots
var dotColorActive = 0x000099;      // Color of active dots
//---CONSTANTS -- DON'T TOUCH THIS SHIT
const Y_OFFSET = 200;               // y-offset for the grid
const LEFTY = 325;                  // Fudge-factor
const X_OFFSET = 130;               // Left-most X value for grid
const LINESPACE = 40;               // Space between grid-lines
const ROWS = 6;                     // Number of rows in grid
const COLUMNS = 20;                 // Number of columns in grid
const TRIG_RADIUS = LINESPACE / 3;  // Radius at which a block is 'activated' (for placing blocks)
//------------
var vertLines = [];                 // Array of vertical lines
var hozLines = [];                  // Array of horizontal lines
var title;                          // Title text
var mouseTrack;                     // DEBUG - Tracks mouse x,y on-screen
var testbock;                       // DEBUG - test block container
var game = new Phaser.Game(config);
var grid = new Array(ROWS);   // STORES IMPORTANT INFORMATION ABOUT GRID! HOLDS INFO FOR JSON
for(let i = 0; i < grid.length; i++) {
    grid[i] = new Array(COLUMNS);
}
function preload() {
    this.load.image('BACKGROUND', 'assets/background.png'); // preload background image
    this.load.image('TESTBLOCK', 'assets/testblock.png'); // DEBUG-- preoad test block image
}



function create() {
    // Enables blocks to be dragged -- DON'T TOUCH IT
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
    // adds background image
    this.add.image(512, 384, 'BACKGROUND'); 
    
    //--TEST CODE   
    testblock = this.add.image(100,200,'TESTBLOCK');
    testblock.setInteractive();
    this.input.setDraggable(testblock);
    testblock.on('dragend', snapToGrid);
    //--TEST CODE

    // title text
    title = this.add.text(400, 100, "Q-Groov :-]", { fontFamily: '"Segoe UI"', fontSize: 50 });
    // DEBUG: tracks mouse on-screen
    mouseTrack = this.add.text(150, 100, "", { fontFamily: '"Segoe UI"', fontSize: 50 });

    // -- COMPOSES THE GRID TO BE SENT TO BACKEND
    class Block {
        constructor(x, y, curScene) {
            this.blockType = ""; // STRING: holds the block-type
            this.entangID = 0;   // NUM: contains ID if block is entangled with other blocks
            this.locX = x; 
            this.locY = y;              // NUM: column which contains the block -- NOT SENT TO BACKEND
            this.active = false;        // BOOL: if mouse is over: active
            // ELIPSE-SHAPE: dot drawn at [x,y] loc -- NOT SENT TO BACKEND
            this.dot = curScene.add.ellipse(this.locX, this.locY, dotSize, dotSize, dotColorDefault);
            this.dot.setInteractive();
            this.dot.on('pointerover', () => { this.dot.fillColor = dotColorActive; this.active = true;});
            this.dot.on('pointerout', () => { this.dot.fillColor = dotColorDefault; this.active = false;});
        }
    }

    // Draw the horizontal lines of the grid - LEAVE IT ALONE
    for (let y = 0; y < ROWS; y++) {
        vertLines.push(this.add.line
            (X_OFFSET + 380, 0, 0, Y_OFFSET + LINESPACE * y, (LINESPACE - 2) * COLUMNS, Y_OFFSET + LINESPACE * y, hozLineColor));
    }

    // Draw the vertical lines of the grid - LEAVE IT ALONE
    for (let x = 0; x < COLUMNS; x++) {
        hozLines.push(this.add.line(X_OFFSET + x * LINESPACE, LEFTY - 25, 0, 0, 0, LINESPACE * (ROWS - 1), vertLineColor));
    }

    // Initialize the grid with blocks
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            let xval = X_OFFSET + y * LINESPACE;
            let yval = Y_OFFSET + x * LINESPACE;
            grid[x][y] = new Block(xval, yval, this);
        }    
    }
    console.log(grid);
}

// snaps the active block to the grid
function snapToGrid() {
    console.log(grid);
    for (let a = 0; a < ROWS; a++) {
        for (let b = 0; b < COLUMNS; b++) {
            if(grid[a][b].active) {
                this.x = grid[a][b].locX;
                this.y = grid[a][b].locY;
                return;  
            }
        }
    }
}

function update() {
    //SHOWS MOUSE COORDS IN SCREEEN FOR DEBUGGING
    mouseTrack.text = `[${this.input.x} , ${this.input.y}]`;

    // SAVING THIS FOR A RAINY DAY BUT IT'S DUMB
    /* for (let x = 0; x < COLUMNS; x++) {
        for (let y = 0; y < ROWS; y++) {
            // proximity between mouse and current block
            let deltaX = (Math.abs(grid[x, y].x - this.input.x));
            let deltaY = (Math.abs(grid[x, y].y - this.input.y));

            // if mouse cursor is within activation radius, change the color of block's dot
            if (deltaX < TRIG_RADIUS && deltaY < TRIG_RADIUS) {
                grid[x, y].dot.fillColor = dotColorActive;
            }
            else if (grid[x, y].dot.fillColor != dotColorDefault) {
                grid[x, y].dot.fillColor = dotColorDefault;
            }
        }
    }*/
}

function render() {
}