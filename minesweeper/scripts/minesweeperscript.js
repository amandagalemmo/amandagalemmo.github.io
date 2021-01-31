/*@TODO:
    - create a newGame method
    - allow map to resize with window? this is a stretch goal
    - add flagging
    - endgame. expose all bricks/hints*/

// Initializations______________________________________________________________
var canvas;
var ctx;

var ROWS;
var COLS;
var leftPadding;
var topPadding;

var numMines;
var numTiles;
var playerInit;
var playerR;
var playerC;
var adjacent;
var score;
var tiles;
var gameOver = false;

// @TODO: change to 32
const TILEDIM = 24;                                   // Dimensions of each tile

const sprite = new Image();
sprite.src = '../img/guy.png';

const flag_img = new Image();
flag_img.src = '../img/flag.png';



// Palette
var colors = {
  hidden: '#56727a', //355070 //#964548 -- deeper red //#458396 -- blue
  borderDistant: '#6d597a',
  seenDistant: '#b56578',
  borderNear: '#e56b6f', 
  seenNear: '#eaac8b',
  player: '#a3d6c8'    //rgba(163, 214, 200, 0.5)
}

window.onload = function() {
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext('2d');
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  var game = new Phaser.Game(ctx.canvas.width, ctx.canvas.height, canvas, 
    {preload: preload, create: create});

  function preload() {
    // each tile is 32x32
    // 3 frames in each sprite sheet

    game.load.spritesheet('')
  }

  ROWS = Math.floor(ctx.canvas.height / TILEDIM)
  COLS = Math.floor(ctx.canvas.width / TILEDIM);
  leftPadding = Math.ceil((ctx.canvas.width - (COLS * TILEDIM)) / 2);
  topPadding = Math.ceil((ctx.canvas.height - (ROWS * TILEDIM)) / 2);
  numTiles = ROWS * COLS;
  numMines = Math.ceil(numTiles * .125);

  playerInit = getRandomInt(numTiles);              // player initial location
  playerR = Math.floor(playerInit / COLS);          // player initial R coord
  playerC = playerInit - playerR * COLS;            // player initial C coord

  adjacent = initializeBoard();
  score = 0;

  tiles = [];
  for (var r = 0; r < ROWS; r++) {
    tiles[r] = [];
    for (var c = 0; c < COLS; c++) {
      tiles[r][c] = {
        cX : c * TILEDIM,      //coords for canvas
        cY: r * TILEDIM,       //coords for canvas
        num: (r * COLS + c),
        visited: false,
        neighbors: adjacent[(r * COLS + c)],
        color: colors.hidden,
        flagged: false
      };
    }
  }
  console.log('loaded');
  move();
  draw();
}

// UI___________________________________________________________________________
window.addEventListener('resize', reportWindowSize);
document.addEventListener('keydown', keyDownHandler, {once: true});
document.addEventListener('click', clickHandler);

function clickHandler(e) {
  let clickC = Math.floor((e.clientX - leftPadding) / TILEDIM);
  let clickR = Math.floor((e.clientY - topPadding) / TILEDIM);
  if (tiles[clickR][clickC].flagged) {
    tiles[clickR][clickC].flagged = false;
  } else if (!tiles[clickR][clickC].visited) {
    tiles[clickR][clickC].flagged = true;
  } else {return;}
  drawFlag(clickR, clickC);
}

function reportWindowSize() {
    ctx.canvas.width = window.innerWidth - TILEDIM;
    ctx.canvas.height = window.innerHeight - TILEDIM;
    leftPadding = Math.ceil((ctx.canvas.width - (COLS * TILEDIM)) / 2);
    topPadding = Math.ceil((ctx.canvas.height - (ROWS * TILEDIM)) / 2);
    draw();
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === 'd') {
    if (playerC < COLS - 1 && !tiles[playerR][playerC+1].flagged) playerC++;
    console.log('keydown right');
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === 'a') {
    if (playerC > 0 && !tiles[playerR][playerC-1].flagged) playerC--;
    console.log('keydown left');
  } else if (e.key === "Down" || e.key === "ArrowDown" || e.key === 's') {
    if (playerR < ROWS  - 1 && !tiles[playerR+1][playerC].flagged) playerR++;
    console.log('keydown down');
  } else if (e.key === "Up" || e.key === "ArrowUp" || e.key === 'w') {
    if (playerR > 0 && !tiles[playerR-1][playerC].flagged) playerR--;
    console.log('keydown up');
  }

  setTimeout(function() {
    move();
    draw();
    document.addEventListener('keydown', keyDownHandler, {once: true});}, 250);
}

// Helper functions_____________________________________________________________
function getRandomInt(numTiles) {
  return Math.floor(Math.random() * numTiles);
}

// @TODO: must refactor this
function initializeBoard() {
  let adjacent = new Array(numTiles).fill(0);
  let m = 0;
  // The following is a hacky way to establish borders when counting adjacency
  var bLeft = new Array();
  var bRight = new Array();
  for (let i = 0; i < numTiles; i+=COLS) {bLeft.push(i);}
  for (let i = COLS-1; i < numTiles; i+=COLS) {bRight.push(i);}

  while (m < numMines) {
    let i = getRandomInt(numTiles);
    // @TODO: do not like that it's a while loop
    while (true) {
      if (i === playerInit || adjacent[i] === 9) {
        i = getRandomInt(numTiles);
      } else {break;}
    }
    adjacent[i] = 9;
    for (let y = -COLS; y <= COLS; y += COLS) {
      if (i + y < 0 || i + y >= numTiles) {continue;}
      for (let x = -1; x < 2; x++) {
        if (i + x < 0 || i + x >= numTiles) {continue;}
        else if (bLeft.includes(i) && x === -1) {continue;}
        else if (bRight.includes(i) && x === 1) {continue;}
        let j = i + x + y;
        if (adjacent[j] < 9) {
          adjacent[j]++;
        }
      }
    }
    m++;
  }
  return adjacent;
}

// Drawing functions____________________________________________________________
function drawBoard() {
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      drawFlag(r, c);
      drawPlayer();
      if (tiles[r][c].visited) {drawHint(r,c)};
    }
  }
}

function drawTile(r, c) {
  ctx.beginPath();
  ctx.rect(tiles[r][c].cX + leftPadding, tiles[r][c].cY + topPadding,
    TILEDIM, TILEDIM);
  ctx.fillStyle = tiles[r][c].color;
  ctx.fill();
  ctx.closePath();
}

//ctx.rect(tiles[playerR][playerC].cX + leftPadding, tiles[playerR][playerC].cY + topPadding,
//         TILEDIM, TILEDIM);
//ctx.fillStyle = 'rgba(163, 214, 200, 0.5)';
// ctx.lineWidth = '3';
// ctx.strokeStyle = colors['player'];
function drawPlayer() {
  ctx.beginPath();
  ctx.drawImage(sprite, tiles[playerR][playerC].cX + leftPadding,
    tiles[playerR][playerC].cY + topPadding);
  ctx.fill();
  ctx.closePath();
}

function drawHint(r, c) { // i've done something stupid here
  if (tiles[r][c].neighbors > 8) {
    ctx.beginPath();
    ctx.drawImage(flag_img, tiles[r][c].cX + leftPadding, tiles[r][c].cY + topPadding);
    ctx.fill();
    ctx.closePath();
  } else {
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(tiles[r][c].neighbors>0 ? `${tiles[r][c].neighbors}` : ' ',
    tiles[r][c].cX + 8 + leftPadding, tiles[r][c].cY + 16+ topPadding, TILEDIM);
  }  
}

function drawFlag(r, c) {
  if (tiles[r][c].flagged) {
    ctx.beginPath();
    ctx.drawImage(flag_img, tiles[r][c].cX + leftPadding, tiles[r][c].cY + topPadding);
    ctx.fill();
    ctx.closePath();
    
    // ctx.font = '12 px Arial';
    // ctx.fillStyle = 'white';
    // ctx.fillText('!',
    //   tiles[r][c].cX+8+leftPadding, tiles[r][c].cY+16+topPadding, TILEDIM);
  } else {
    drawTile(r, c);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawPlayer();
}

// Move player__________________________________________________________________
function move() {
  // if the tile is a mine...
  if (tiles[playerR][playerC].neighbors === 9) {
    gameOver = true;
    sprite.src = '../img/guySad.png';
    handleGameOver();
    return;
  }
  // if the tile we just moved to hasn't been visited...
  if (!tiles[playerR][playerC].visited) {
    tiles[playerR][playerC].visited = true;
    let exposeQ = [];
    let currQueue = new Set();
    exposeQ.push(tiles[playerR][playerC]);
    while (exposeQ.length > 0 && exposeQ[0] !== null) {
      let currNode = exposeQ.shift();
      currQueue.delete(currNode);
      //handles current tile, returns list of exposure-ready neighbors
      let result = handleTile(currNode.cY / TILEDIM, currNode.cX / TILEDIM);
      if (result !== null && result.length > 0) {
        for (let r of result) {
          currQueue.add(r);
        }
        exposeQ = [...currQueue];
      }
    }
  }
}

function handleTile(r, c) {
  tiles[r][c].visited = true;
  let toQueue = null;
  try {
    assignColor(tiles[r][c]);
  } catch (error) {
    console.error(error);
    console.log(r + ' ' + c);
    return;
  }
  if (tiles[r][c].neighbors === 0) {
    toQueue = new Array();
    for (i = -1; i <= 1; i += 2) {
      if ((r + i > -1 && r + i < ROWS) && !tiles[r + i][c].visited) {
        toQueue.push(tiles[r + i][c]);
      }
      if ((c + i > -1 && c + i < COLS) && !tiles[r][c + i].visited) {
        toQueue.push(tiles[r][c + i]);
      }
      if ((r + i > -1 && r + i < ROWS) && (c + i > -1 && c + i < COLS) &&
           !tiles[r + i][c + i].visited) {
        toQueue.push(tiles[r + i][c + i]);
      }
      if ((r - i > -1 && r - i < ROWS) && (c - i > -1 && c - i < COLS) &&
           !tiles[r - i][c - i].visited) {
        toQueue.push(tiles[r - i][c - i]);
      }
      if ((r - i > -1 && r - i < ROWS) && (c + i > -1 && c + i < COLS) &&
           !tiles[r - i][c + i].visited) {
        toQueue.push(tiles[r - i][c + i]);
      }
      if ((r + i > -1 && r + i < ROWS) && (c - i > -1 && c - i < COLS) &&
           !tiles[r + i][c - i].visited) {
        toQueue.push(tiles[r + i][c - i]);
      }
    }
  } else {
    toQueue = new Array();
    for (i = -1; i <= 1; i += 2) {
      if ((r + i > -1 && r + i < ROWS) && !tiles[r + i][c].visited &&
        tiles[r + i][c].neighbors == 0) {
        toQueue.push(tiles[r + i][c]);
      }
      if ((c + i > -1 && c + i < COLS) && !tiles[r][c + i].visited &&
        tiles[r][c + i].neighbors == 0) {
        toQueue.push(tiles[r][c + i]);
      }
    }
  }
  return toQueue;
}

function assignColor(tile) {
  if (tile.neighbors === 0) {
    tile.color = colors.seenNear;
  } else if (tile.neighbors === 9) {
    return;
  } else {
    tile.color = colors.borderNear;
  }
}

function handleGameOver() {
  console.log('GAME OVER!');
  drawBoard();
  drawPlayer();
  setTimeout(alert, 250, 'Game over! Refresh to play again');
  document.removeEventListener('keydown', keyDownHandler, {once: true});
}
