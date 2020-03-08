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
//---CONSTANTS -- DON'T TOUCH THIS 
const Y_OFFSET = 200;               // y-offset for the grid
const LEFTY = 325;                  // Fudge-factor
const X_OFFSET = 130;               // Left-most X value for grid
const LINESPACE = 40;               // Space between grid-lines
const ROWS = 6;                     // Number of rows in grid
const COLUMNS = 20;                 // Number of columns in grid
const TRIG_RADIUS = LINESPACE / 3;  // Radius at which a block is 'activated' (for placing blocks)
const BLOCK_SELECT_X = 150;
const BLOCK_SELECT_Y = 450;
//------------
var vertLines = [];                 // Array of vertical lines
var hozLines = [];                  // Array of horizontal lines
var title;                          // Title text
var mouseTrack;                     // DEBUG - Tracks mouse x,y on-screen
var testbock;                       // DEBUG - test block container
var game = new Phaser.Game(config);
var grid = new Array(ROWS);         // STORES IMPORTANT INFORMATION ABOUT GRID! HOLDS INFO FOR JSON
for(let i = 0; i < grid.length; i++) {
    grid[i] = new Array(COLUMNS);
}
var blockList = [];
var blockListCreated = [];
var sceneRef;
// string identifiers for each unique block-type
const BLOCK_NAMES = ["CH","CRZ","H","ID","RX",
                     "RY","S","S_UP","T","T_UP",
                     "U1","U2","U3","X","Y", "BCON"];

// -- Elements which are draggable by the user
class DragBlock {
    constructor(img, curScene, id) {
            this.attachedTo = null;
            this.img = img;
            this.img.setInteractive();
            curScene.input.setDraggable(this.img);
            this.img.on('dragend', snapToGrid.bind(this));
            this.id = id;
            this.created = false;
    }
}

// -- COMPOSES THE GRID TO BE SENT TO BACKEND
class Block {
    constructor(x, y, curScene) {
        this.blockType = "";        // STRING: holds the block-type
        this.entangID = 0;          // NUM: contains ID if block is entangled with other blocks
        this.locX = x;              // NUM: relative x-loc of block -- NOT SENT TO BACKEND
        this.locY = y;              // NUM: relative y-loc of block -- NOT SENT TO BACKEND
        this.focus = false;         // BOOL: if mouse is over: in focus
        this.active = false;        // BOOL: the block is active (exists)
            
        // ELIPSE-SHAPE: dot drawn at [x,y] loc -- NOT SENT TO BACKEND
        this.dot = curScene.add.ellipse(this.locX, this.locY, dotSize, dotSize, dotColorDefault);
        this.dot.setInteractive();
        this.dot.on('pointerover', () => { this.dot.fillColor = dotColorActive; this.focus = true;});
        this.dot.on('pointerout', () => { this.dot.fillColor = dotColorDefault; this.focus = false;});
    }
}

// PHASER METHOD -- preloads assets for the create() function
function preload() {
    this.load.image('BACKGROUND','assets/background.png'); 
    this.load.image('CH', 'assets/icon_cH.png'); 
    this.load.image('CRZ', 'assets/icon_crz.png'); 
    this.load.image('H', 'assets/icon_H.png'); 
    this.load.image('ID', 'assets/icon_ID.png'); 
    this.load.image('RX', 'assets/icon_RX.png');
    this.load.image('RY', 'assets/icon_RY.png');
    this.load.image('S', 'assets/icon_S.png');
    this.load.image('S_UP', 'assets/icon_S_up.png'); 
    this.load.image('T', 'assets/icon_T.png'); 
    this.load.image('T_UP', 'assets/icon_T_Up.png'); 
    this.load.image('U1', 'assets/icon_U1.png'); 
    this.load.image('U2', 'assets/icon_U2.png'); 
    this.load.image('U3', 'assets/icon_U3.png'); 
    this.load.image('X', 'assets/icon_X.png');
    this.load.image('Y', 'assets/icon_Z.png'); 
    this.load.image('BCON', 'assets/icon_circle.png');
}

function create() {
    sceneRef = this;
    // Enables blocks to be dragged -- DON'T TOUCH IT
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
    // adds background image
    var background = this.add.image(512, 384, 'BACKGROUND'); 
    
    refScene = this;
    // all of the possible blocks a user can drag
    for(let i = 0; i < BLOCK_NAMES.length; i++) {
        blockList.push(new DragBlock
            (this.add.image(BLOCK_SELECT_X + i*50,BLOCK_SELECT_Y,BLOCK_NAMES[i]),this,BLOCK_NAMES[i]));
    }    
    // title text
    title = this.add.text(400, 100, "Q-Groov :-]", { fontFamily: '"Segoe UI"', fontSize: 50 });
    
    
    // DEBUG: tracks mouse on-screen
    mouseTrack = this.add.text(150, 100, "", { fontFamily: '"Segoe UI"', fontSize: 50 });

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
}

// snaps the active block to the grid
function snapToGrid() {
    console.log(sceneRef);
    // if DragBlock is attached to a block, de-activate that block and detatch
    if(this.attachTo != null) {
        this.attachTo.active = false;
        this.attachTo = null;
    }
    var breakLoop = false;
    for (let a = 0; a < ROWS; a++) {
        for (let b = 0; b < COLUMNS; b++) {
            if(grid[a][b].focus) {
                if(this.created) {
                    this.img.x = grid[a][b].locX;
                    this.img.y = grid[a][b].locY;
                    this.attachTo = grid[a][b];
                }
                else blockListCreated.push(new DragBlock(sceneRef.add.image(grid[a][b].locX,grid[a][b].locY,this.id),sceneRef,this.id));          
                grid[a][b].active = true;
                grid[a][b].blockType = this.id;
                breakLoop = true;
                break;
                }
            }
            if(breakLoop) break;
        }
        
        for(let i = 0; i < BLOCK_NAMES.length; i++) {
            blockList[i].img.x = BLOCK_SELECT_X + i*50;
            blockList[i].img.y = BLOCK_SELECT_Y;
        }    

        for (let y = 0; y < grid[0].length; y++) {
            let entangList = [];
            for (let x = 0; x < grid.length; x++) {
                if(grid[x][y].blockType == "BCON") {
                    entangList.push(grid[x][y]);
                }
            }
            if(entangList.length > 1) {
                console.log("Entangled!");
                    sceneRef.add.line
                    (0, 0, 
                        entangList[0].locX, entangList[0].locY, 
                        entangList[entangList.length - 1].locX, entangList[entangList.length - 1].locY
                        , 0, hozLineColor);
            }    
        }
    }

function update() {
    //SHOWS MOUSE COORDS IN SCREEEN FOR DEBUGGING
    mouseTrack.text = `[${this.input.x} , ${this.input.y}]`;
}

function render() {
} 