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
var adjacent;  // {[tileIndex: number]: number}
var score;
var tiles; // 2d array of tile objects

const TILEDIM = 32; // Dimensions of each tile

const sprite = new Image();
sprite.src = 'img/guy.png';

const flagImg = new Image();
flagImg.src = 'img/flag.png';

const tilemapSpriteSheet = new Image();
tilemapSpriteSheet.src = "img/tilemap.png";

const starSpriteSheet = new Image();
starSpriteSheet.src = "img/star-animation.png";

const goalSpriteSheet = new Image();
goalSpriteSheet.src = "img/stairs.png";

// Palette
var colors = {
  empty: "#eaac8b",
  hasNeighbors: "#e56b6f",
  hidden: "#4188ad"
}

window.onload = function() {
  initializeBoardState();
  console.log('loaded');
}

// UI___________________________________________________________________________
window.addEventListener('resize', reportWindowSize);
document.addEventListener('keydown', keyDownHandler, {once: true});
document.addEventListener('click', clickHandler);

window.addEventListener("keydown", function(e) {
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);

class Tile {
  cX; // x coord on canvas
  cY; // y coord on canvas
  index; // index of tile
  visited = false;
  numNeighbors; // num of neighboring mines
  color = colors.hidden;
  flagged = false;
  goalTile = false;

  constructor(row, col, adjacencyMap) {
    this.cX = col * TILEDIM;
    this.cY = row * TILEDIM;
    this.index = row * COLS * col;
    this.numNeighbors = adjacencyMap[row * COLS * col];
  }
}

function initializeBoardState() {
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext('2d');

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  ROWS = Math.floor(ctx.canvas.height / TILEDIM)
  COLS = Math.floor(ctx.canvas.width / TILEDIM);
  leftPadding = Math.ceil((ctx.canvas.width - (COLS * TILEDIM)) / 2);
  topPadding = Math.ceil((ctx.canvas.height - (ROWS * TILEDIM)) / 2);
  numTiles = ROWS * COLS;
  numMines = Math.ceil(numTiles * .125); //TODO extract to variable

  playerInit = getRandomInt(numTiles);              // player initial location
  playerR = Math.floor(playerInit / COLS);          // player initial R coord
  playerC = playerInit % COLS;            // player initial C coord

  adjacent = setMines();
  score = 0;

  tiles = [];
  for (var r = 0; r < ROWS; r++) {
    tiles[r] = [];
    for (var c = 0; c < COLS; c++) {
      tiles[r][c] = {
        cX : c * TILEDIM,      //coords for canvas
        cY: r * TILEDIM,       //coords for canvas
        num: (r * COLS + c), // Index of tile in flat array
        visited: false,
        numNeighbors: adjacent[(r * COLS + c)],
        color: colors.hidden,
        flagged: false,
        goalTile: false
      };
    }
  }

  setGoalTile();
  move();
  draw();
}

function clickHandler(e) {
  let clickC = Math.floor((e.clientX - leftPadding) / TILEDIM);
  let clickR = Math.floor((e.clientY - topPadding) / TILEDIM);
  console.log("clickC", clickC);
  console.log("clickR", clickR);
  if (tiles[clickR][clickC].flagged) {
    tiles[clickR][clickC].flagged = false;
    drawTile(clickR, clickC);
  } else if (!tiles[clickR][clickC].visited) {
    tiles[clickR][clickC].flagged = true;
    drawFlag(clickR, clickC);
  } else {return;}
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

function setMines() {
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
    while (i === playerInit || adjacent[i] === 9) {
      i = getRandomInt(numTiles);
    }
    // Mine is at tile i, so adjacency is 9.
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

function setGoalTile() {
  let goalTileIndex = getRandomInt(numTiles);
  while (adjacent[goalTileIndex] === 9) {
    goalTileIndex = getRandomInt(numTiles);
  }
  tiles[Math.floor(goalTileIndex/COLS)][goalTileIndex % COLS].goalTile = true;
}

function assignTileColor(tile) {
  if (tile.goalTile) return;
  if (tile.numNeighbors === 0) {
    tile.color = colors.empty;
  } else if (tile.numNeighbors === 9) {
    tile.color = colors.hidden;
  } else {
    tile.color = colors.hasNeighbors;
  }
}

// Drawing functions____________________________________________________________
function drawBoard() {
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      drawTile(r, c);
      if (tiles[r][c].flagged) drawFlag(r,c);
      if (tiles[r][c].visited) drawHint(r,c);
      if (tiles[r][c].goalTile) drawGoal(r,c);
    }
    // debugger;
  }
}

function drawTile(r, c) {
  function drawTileImage(tileImgR, tileImgC, currTileX, currTileY) {
    ctx.beginPath();
    ctx.drawImage(
      tilemapSpriteSheet,
      tileImgR * TILEDIM,
      tileImgC * TILEDIM,
      TILEDIM,
      TILEDIM,
      currTileX + leftPadding,
      currTileY + topPadding,
      TILEDIM,
      TILEDIM
    );
    ctx.fill();
    ctx.closePath();
  }

  // Default tile values
  var currTile = tiles[r][c];
  let tilemapC = 0;
  let tilemapR = 0;
  
  // First, fill with base color
  ctx.beginPath();
  ctx.rect(tiles[r][c].cX + leftPadding, tiles[r][c].cY + topPadding,
    TILEDIM, TILEDIM);
  ctx.fillStyle = tiles[r][c].color;
  ctx.fill();
  ctx.closePath();

  // north is visited
  const nIsVisited = tiles[r - 1] && tiles[r - 1][c].visited;
  // south is visited
  const sIsVisited = tiles[r + 1] && tiles[r + 1][c].visited;
  // east is visited
  const eIsVisited = tiles[r][c + 1] && tiles[r][c + 1].visited;
  // west is visited
  const wIsVisited = tiles[r][c - 1] && tiles[r][c - 1].visited;

  // If currTile.numNeighbors == 0 and currTile.visited, do nothing
  // Handle visible tiles with neighbors
  if (currTile.numNeighbors > 0 && currTile.visited) {
    // Handle tile's border with unvisited neighbors.
    if (!nIsVisited) {
      if (!sIsVisited) {
        if (!wIsVisited) {
          if (!eIsVisited) {
            tilemapC = 8;
            tilemapR = 6;
          } else {
            tilemapC = 7;
            tilemapR = 5;
          }
        } else if (!eIsVisited) {
          tilemapC = 8;
          tilemapR = 5;
        } else {
          tilemapC = 7;
          tilemapR = 4;
        }
      } else if (!wIsVisited) {
        if (!eIsVisited) {
          tilemapC = 7;
          tilemapR = 6;
        } else {
          tilemapC = 3;
          tilemapR = 5;
        }
      } else if (!eIsVisited) {
        tilemapC = 5;
        tilemapR = 5;
      } else {
        tilemapC = 4;
        tilemapR = 5;
      }
    } else if (!sIsVisited) {
      if (!wIsVisited) {
        if (!eIsVisited) {
          tilemapC = 7;
          tilemapR = 7;
        } else {
          tilemapC = 3;
          tilemapR = 7;
        }
      } else if (!eIsVisited) {
        tilemapC = 5;
        tilemapR = 7;
      } else {
        tilemapC = 4;
        tilemapR = 7;
      }
    } else if (!wIsVisited) {
      if (!eIsVisited) {
        tilemapC = 8;
        tilemapR = 7;
      } else {
        tilemapC = 3;
        tilemapR = 6;
      }
    } else if (!eIsVisited) {
      tilemapC = 5;
      tilemapR = 6;
    }

    if (tilemapC || tilemapR) {
      drawTileImage(tilemapC, tilemapR, currTile.cX, currTile.cY);
      tilemapC = 0;
      tilemapR = 0;
    }

    let nHasNeighbors = false;
    let nwHasNeighbors = false;
    let neHasNeighbors = false;
    let sHasNeighbors = false;
    let swHasNeighbors = false;
    let seHasNeighbors = false;
    let eHasNeighbors = false;
    let wHasNeighbors = false;

    if (tiles[r - 1] !== undefined) {
      nHasNeighbors = !!tiles[r - 1][c].numNeighbors;
      nwHasNeighbors = tiles[r - 1][c - 1] !== undefined &&
        !!tiles[r - 1][c - 1].numNeighbors;
      neHasNeighbors = tiles[r - 1][c + 1] !== undefined &&
        !!tiles[r - 1][c + 1].numNeighbors;
    }

    if (tiles[r + 1] !== undefined) {
      sHasNeighbors = !!tiles[r + 1][c].numNeighbors;
      swHasNeighbors = tiles[r + 1][c - 1] !== undefined &&
        !!tiles[r + 1][c - 1].numNeighbors;
      seHasNeighbors = tiles[r + 1][c + 1] !== undefined &&
        !!tiles[r + 1][c + 1].numNeighbors;
    }
    eHasNeighbors = tiles[r][c + 1] !== undefined &&
      !!tiles[r][c + 1].numNeighbors;
    wHasNeighbors = tiles[r][c - 1] !== undefined &&
      !!tiles[r][c - 1].numNeighbors;
    
    // Handle dithering
    let overrideCheck = false;
    if (nIsVisited && !nHasNeighbors) {
      if (
        sIsVisited && sHasNeighbors &&
        eIsVisited && eHasNeighbors &&
        !seHasNeighbors
      ) {
        tilemapC = 5;
        tilemapR = 2;
      } else if (
        sIsVisited && sHasNeighbors &&
        wIsVisited && wHasNeighbors &&
        !swHasNeighbors
      ) {
        tilemapC = 4;
        tilemapR = 2;
      } else if (eIsVisited && !eHasNeighbors) {
        tilemapC = 4;
        tilemapR = 1;
      } else if (wIsVisited && !wHasNeighbors) {
        tilemapC = 5;
        tilemapR = 1;
      } else { // @TODO might need to handle more conditions
        tilemapC = 2;
        tilemapR = 1;
      }
    } else if (sIsVisited && !sHasNeighbors) {
      if (
        nIsVisited && nHasNeighbors &&
        eIsVisited && eHasNeighbors &&
        !neHasNeighbors
      ) {
        tilemapC = 3;
        tilemapR = 2;
      } else if (
        nIsVisited && nHasNeighbors &&
        wIsVisited && wHasNeighbors &&
        !nwHasNeighbors
      ) {
        tilemapC = 2;
        tilemapR = 2;
      } else if (eIsVisited && !eHasNeighbors) {
        tilemapC = 4;
        tilemapR = 0;
      } else if (wIsVisited && !wHasNeighbors) {
        tilemapC = 5;
        tilemapR = 0;
      } else { // @TODO might need to handle more conditions
        tilemapC = 2;
        tilemapR = 0;
      }
    } else if (eIsVisited && !eHasNeighbors) {
      if (
        nIsVisited && nHasNeighbors &&
        wIsVisited && wHasNeighbors &&
        !nwHasNeighbors
      ) {
        tilemapC = 3;
        tilemapR = 3;
      } else if (
        sIsVisited && sHasNeighbors &&
        wIsVisited && wHasNeighbors &&
        !swHasNeighbors
      ) {
        tilemapC = 2;
        tilemapR = 3;
      } else {
        tilemapC = 3;
        tilemapR = 1;
      }
    } else if (wIsVisited && !wHasNeighbors) {
      if (
        nIsVisited && nHasNeighbors &&
        eIsVisited && eHasNeighbors &&
        !neHasNeighbors
      ) {
        tilemapC = 4;
        tilemapR = 3;
      } else if (
        sIsVisited && sHasNeighbors &&
        eIsVisited && eHasNeighbors &&
        !seHasNeighbors
      ) {
        tilemapC = 5;
        tilemapR = 3;
      } else {
        tilemapC = 3;
        tilemapR = 0;
      }
    } else if (
      !nwHasNeighbors &&
      nIsVisited && nHasNeighbors &&
      wIsVisited && wHasNeighbors
    ) {
      if (
        !seHasNeighbors &&
        sIsVisited && sHasNeighbors &&
        eIsVisited && eHasNeighbors
      ) {
        tilemapC = 1;
        tilemapR = 2;
      } else {
        tilemapC = 1;
        tilemapR = 1;
      }
    } else if (
      !neHasNeighbors &&
      nIsVisited && nHasNeighbors &&
      eIsVisited && eHasNeighbors
    ) {
      if (
        !swHasNeighbors &&
        sIsVisited && sHasNeighbors &&
        wIsVisited && wHasNeighbors
      ) {
        tilemapC = 0;
        tilemapR = 2;
      } else {
        tilemapC = 0;
        tilemapR = 1;
      }
    } else if (
      !seHasNeighbors &&
      sIsVisited && sHasNeighbors &&
      eIsVisited && eHasNeighbors
    ) {
      tilemapC = 0;
      tilemapR = 0;
      overrideCheck = true;
    } else if (
      !swHasNeighbors &&
      sIsVisited && sHasNeighbors &&
      wIsVisited && wHasNeighbors
    ) {
      tilemapC = 1;
      tilemapR = 0;
    }
    
    if (tilemapC || tilemapR || overrideCheck) {
      // drawing dither
      // console.log(`tilemap coords (c, r) (${tilemapC}, ${tilemapR})`);
      // const logString = `nHasNeighbors ${nHasNeighbors}\nsHasNeighbors ${sHasNeighbors}\neHasNeighbors ${eHasNeighbors}\nwHasNeighbors ${wHasNeighbors}\nnwHasNeighbors ${nwHasNeighbors}\nneHasNeighbors ${neHasNeighbors}\nseHasNeighbors ${seHasNeighbors}\nswHasNeighbors ${swHasNeighbors}\nnIsVisited ${nIsVisited}\nsIsVisited ${sIsVisited}\neIsVisited ${eIsVisited}\nwIsVisited ${wIsVisited}`;
      // console.log(logString);
      drawTileImage(tilemapC, tilemapR, currTile.cX, currTile.cY);
      tilemapC = 0;
      tilemapR = 0;
      overrideCheck = false;
      // debugger;
    }
  }

  // Handle borders for unvisited tiles
  if (!currTile.visited) {
    if (nIsVisited) {
      if (eIsVisited && wIsVisited && sIsVisited) {
        tilemapC = 1;
        tilemapR = 5;
      } else if (eIsVisited && sIsVisited) {
        tilemapC = 8;
        tilemapR = 2;
      } else if (wIsVisited && sIsVisited) {
        tilemapC = 7;
        tilemapR = 2;
      } else if (wIsVisited && eIsVisited) {
        tilemapC = 7;
        tilemapR = 0;
      } else if (eIsVisited) {
        tilemapC = 1;
        tilemapR = 7;
      } else if (wIsVisited) {
        tilemapC = 0;
        tilemapR = 7;
      } else {
        tilemapC = 4;
        tilemapR = 8;
      }
    } else if (sIsVisited) {
      if (eIsVisited && wIsVisited) {
        tilemapC = 7;
        tilemapR = 1;
      } else if (eIsVisited) {
        tilemapC = 1;
        tilemapR = 8;
      } else if (wIsVisited) {
        tilemapC = 0;
        tilemapR = 8;
      } else {
        tilemapC = 4;
        tilemapR = 4;
      }
    } else if (eIsVisited) {
      tilemapC = 2;
      tilemapR = 6;
    } else if (wIsVisited) {
      tilemapC = 6;
      tilemapR = 6;
    }

    if (tilemapR || tilemapC) {
      drawTileImage(tilemapC, tilemapR, currTile.cX, currTile.cY);
      tilemapC = 0;
      tilemapR = 0;
    }
  }
  ctx.save();
}

function drawPlayer() {
  ctx.beginPath();
  ctx.drawImage(sprite, tiles[playerR][playerC].cX + leftPadding,
    tiles[playerR][playerC].cY + topPadding);
  ctx.fill();
  ctx.closePath();
  ctx.save();
}

function drawHint(r, c) { // i've done something stupid here
  if (tiles[r][c].goalTile) {
    return;
  } else {
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(tiles[r][c].numNeighbors>0 ? `${tiles[r][c].numNeighbors}` : ' ',
      tiles[r][c].cX + (TILEDIM * 0.33) + leftPadding, tiles[r][c].cY + (TILEDIM * 0.66) + topPadding, TILEDIM);
  }
  ctx.save();
}

function drawFlag(r, c) {
  ctx.beginPath();
  ctx.drawImage(flagImg, c * TILEDIM + leftPadding, r * TILEDIM + topPadding);
  ctx.fill();
  ctx.closePath();
}

function drawGoal(r, c) {
  const imageSource = tiles[r][c].visited ? goalSpriteSheet : starSpriteSheet;
  ctx.beginPath();
  ctx.drawImage(imageSource, 0, 0, TILEDIM, TILEDIM, c * TILEDIM + leftPadding, r * TILEDIM + topPadding, TILEDIM, TILEDIM);
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawPlayer();
}

// Move player__________________________________________________________________
function move() {
  // if the tile is a mine...
  if (tiles[playerR][playerC].numNeighbors === 9) {
    // sprite.src = 'img/guySad.png';
    handleGameOver();
    return;
  }

  // if the tile is the goal...
  if (tiles[playerR][playerC].goalTile) {
    handleWin();
  }

  // if the tile we just moved to hasn't been visited...
  if (!tiles[playerR][playerC].visited) {
    tiles[playerR][playerC].visited = true;
    let exposeQ = [];
    let currQueue = new Set();
    exposeQ.push(tiles[playerR][playerC]);
    while (exposeQ.length > 0 && exposeQ[0] !== null) {
      let currTile = exposeQ.shift();
      currQueue.delete(currTile);
      //handles current tile, returns list of exposure-ready neighbors
      let result = handleTile(currTile.cY / TILEDIM, currTile.cX / TILEDIM);
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
    assignTileColor(tiles[r][c]);
  } catch (error) {
    console.error(error);
    console.log(r + ' ' + c);
    return;
  }
  if (tiles[r][c].numNeighbors === 0) {
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
        tiles[r + i][c].numNeighbors == 0) {
        toQueue.push(tiles[r + i][c]);
      }
      if ((c + i > -1 && c + i < COLS) && !tiles[r][c + i].visited &&
        tiles[r][c + i].numNeighbors == 0) {
        toQueue.push(tiles[r][c + i]);
      }
    }
  }
  return toQueue;
}

function handleGameOver() {
  console.log('GAME OVER!');
  // setTimeout(alert, 250, 'Game over! Close to try again');
  initializeBoardState();
  drawPlayer();
  document.removeEventListener('keydown', keyDownHandler, {once: true});
}

function handleWin() {
  console.log('YOU MADE IT!');
  initializeBoardState();
}
