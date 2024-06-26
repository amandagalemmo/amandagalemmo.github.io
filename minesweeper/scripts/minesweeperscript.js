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

goalTileImgY = 32 * 4;
goalTileImgX = 0;

// @TODO: change to 32
const TILEDIM = 32;                                   // Dimensions of each tile

const sprite = new Image();
sprite.src = 'img/guy.png';

const flag_img = new Image();
flag_img.src = 'img/flag.png';

const tilemapImg = new Image();
tilemapImg.src = 'img/tilemap0.png';

// Palette
var colors = {
  hidden: '#4188ad', //355070 //#964548 -- deeper red //#458396 -- blue
  borderDistant: '#6d597a',
  seenDistant: '#b56578',
  borderNear: '#e56b6f', 
  seenNear: '#eaac8b',
  player: '#a3d6c8',    //rgba(163, 214, 200, 0.5)
  goalTile: '#32b855',
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

function initializeBoardState() {
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext('2d');

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  ROWS = Math.floor(ctx.canvas.height / TILEDIM)
  COLS = Math.floor(ctx.canvas.width / TILEDIM);
  leftPadding = Math.ceil((ctx.canvas.width - (COLS * TILEDIM)) / 2);
  // leftPadding = Math.ceil((ctx.canvas.width - (COLS * TILEDIM)) / 2);
  console.log("leftPadding", leftPadding);
  // topPadding = Math.ceil((ctx.canvas.height - (ROWS * TILEDIM)) / 2);
  topPadding = Math.ceil((ctx.canvas.height - (ROWS * TILEDIM)) / 2);
  console.log("topPadding", topPadding);
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
        neighbors: adjacent[(r * COLS + c)],
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
  } else if (!tiles[clickR][clickC].visited) {
    tiles[clickR][clickC].flagged = true;
  } else {return;}
  drawTile(clickR, clickC);
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

  // @TODO: make sure it's possible to reach goal from start
  // rowNum = Math.floor(tileIndex/COLS);
  // colNum = tileindex % COLS;
  tiles[Math.floor(goalTileIndex/COLS)][goalTileIndex % COLS].goalTile = true;
  tiles[Math.floor(goalTileIndex/COLS)][goalTileIndex % COLS].color = colors.goalTile;
}

// Drawing functions____________________________________________________________
function drawBoard() {
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      drawTile(r, c);
      drawPlayer();
      if (tiles[r][c].visited) {drawHint(r,c)};
    }
  }
}

function drawTile(r, c) {
  // Default tile values
  var currTile = tiles[r][c];
  let tilemapX = 0;
  let tilemapY = 0;
  ctx.beginPath();
  if (currTile.goalTile) {
    if (currTile.visited) {
      tilemapX = TILEDIM * 1;
      tilemapY = TILEDIM * 4;
    } else {
      tilemapX = 0;
      tilemapY = TILEDIM * 5;
    }
  } else if (currTile.flagged) {
    tilemapX = TILEDIM * 1;
    tilemapY = TILEDIM * 5;
  } else {
    if (currTile.neighbors === 0 && currTile.visited) {
      tilemapX = TILEDIM * 2;
      tilemapY = TILEDIM * 4;
    } else {
      let numNeighborsVisited = 0;
      var nIsVisited = (tiles[r-1] && tiles[r-1][c].visited);
      if (nIsVisited) numNeighborsVisited++;
      var wIsVisited = (tiles[r][c-1] && tiles[r][c-1].visited);
      if (wIsVisited) numNeighborsVisited++;
      var sIsVisited = (tiles[r+1] && tiles[r+1][c].visited);
      if (sIsVisited) numNeighborsVisited++;
      var eIsVisited = (tiles[r][c+1] && tiles[r][c+1].visited);
      if (eIsVisited) numNeighborsVisited++;
      var nHasNeighbors = (tiles[r-1] && tiles[r-1][c].neighbors);
      var eHasNeighbors = (tiles[r][c+1] && tiles[r][c+1].neighbors);
      var sHasNeighbors = (tiles[r+1] && tiles[r+1][c].neighbors);
      var wHasNeighbors = (tiles[r][c-1] && tiles[r][c-1].neighbors);

      if (currTile.visited) {
        if (!nHasNeighbors) {
          if (!eHasNeighbors) {
            tilemapX = TILEDIM * 2;
            tilemapY = TILEDIM * 1;
          } else if (!wHasNeighbors) {
            tilemapX = TILEDIM * 0;
            tilemapY = TILEDIM * 1;
          } else {
            tilemapX = TILEDIM * 1;
            tilemapY = TILEDIM * 1;
          }
        } else if (!eHasNeighbors) {
          if (!sHasNeighbors) {
            tilemapX = TILEDIM * 2;
            tilemapY = TILEDIM * 3;
          } else {
            tilemapX = TILEDIM * 2;
            tilemapY = TILEDIM * 2;
          }
        } else if (!sHasNeighbors) {
          if (!wHasNeighbors) {
            tilemapX = TILEDIM * 0;
            tilemapY = TILEDIM * 3;
          } else {
            tilemapX = TILEDIM * 1;
            tilemapY = TILEDIM * 3;
          }
        } else if (!wHasNeighbors) {
          tilemapX = TILEDIM * 0;
          tilemapY = TILEDIM * 2;
        }

        if (numNeighborsVisited === 2) {
          if (!nIsVisited) {
            if (!eIsVisited) {
              tilemapX = TILEDIM * 6;
              tilemapY = TILEDIM * 1;
            } else if (!wIsVisited) {
              tilemapX = TILEDIM * 4;
              tilemapY = TILEDIM * 1;
            }
          } else if (!eIsVisited) {
            if (!sIsVisited) {
              tilemapX = TILEDIM * 6;
              tilemapY = TILEDIM * 3;
            }
          } else if (!sIsVisited) {
            if (!wIsVisited) {
              tilemapX = TILEDIM * 4;
              tilemapY = TILEDIM * 3;
            }
          }
        } else if (numNeighborsVisited === 3) {
          if (!nIsVisited) {
            tilemapX = TILEDIM * 1;
            tilemapY = TILEDIM * 3;
          } else if (!eIsVisited) {
            tilemapX = TILEDIM * 0;
            tilemapY = TILEDIM * 2;
          } else if (!sIsVisited) {
            tilemapX = TILEDIM * 1;
            tilemapY = TILEDIM * 1;
          } else if (!wIsVisited) {
            tilemapX = TILEDIM * 2;
            tilemapY = TILEDIM * 2;
          }
        } else if (numNeighborsVisited === 1) {
          if (nIsVisited) {
            tilemapX = TILEDIM * 9;
            tilemapY = TILEDIM * 4;
          } else if (eIsVisited) {
            tilemapX = TILEDIM * 9;
            tilemapY = TILEDIM * 1;
          } else if (sIsVisited) {
            tilemapX = TILEDIM * 9;
            tilemapY = TILEDIM * 3;
          } else if (wIsVisited) {
            tilemapX = TILEDIM * 10;
            tilemapY = TILEDIM * 1;
          }
        }
      } else {
        if (numNeighborsVisited === 4) {
          tilemapX = TILEDIM * 1;
          tilemapY = TILEDIM * 2;
        } else if (numNeighborsVisited === 2) { // @TODO implement numVisited === 3
          if (nIsVisited) {
            if (eIsVisited) {
              tilemapX = TILEDIM * 10;
              tilemapY = TILEDIM * 9;
            } else if (wIsVisited) {
              tilemapX = TILEDIM * 2;
              tilemapY = TILEDIM * 9;
            } else if (sIsVisited) {
              tilemapX = TILEDIM * 9;
              tilemapY = TILEDIM * 2;
            }
          } else if (eIsVisited) {
            if (sIsVisited) {
              tilemapX = TILEDIM * 3;
              tilemapY = TILEDIM * 9;
            } else if (wIsVisited) {
              tilemapX = TILEDIM * 10;
              tilemapY = TILEDIM * 3;
            }
          } else if (sIsVisited) {
            if (wIsVisited) {
              tilemapX = TILEDIM * 7;
              tilemapY = TILEDIM * 9;
            }
          }
        } else if (numNeighborsVisited === 1) {
          if (nIsVisited) {
            tilemapX = TILEDIM * 5;
            tilemapY = TILEDIM * 4;
          } else if (eIsVisited) {
            tilemapX = TILEDIM * 3;
            tilemapY = TILEDIM * 2;
          } else if (sIsVisited) {
            tilemapX = TILEDIM * 5;
            tilemapY = TILEDIM * 0;
          } else if (wIsVisited) {
            tilemapX = TILEDIM * 7;
            tilemapY = TILEDIM * 2;
          }
        }
      }
    }
  }
  if (!tilemapX && !tilemapY) {
    ctx.rect(tiles[r][c].cX + leftPadding, tiles[r][c].cY + topPadding,
      TILEDIM, TILEDIM);
    ctx.fillStyle = tiles[r][c].color;
  } else {
    ctx.drawImage(
      tilemapImg,
      tilemapX,
      tilemapY,
      TILEDIM,
      TILEDIM,
      currTile.cX + leftPadding,
      currTile.cY + topPadding,
      TILEDIM,
      TILEDIM
    );
  }

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
  } else if (tiles[r][c].goalTile) {
    return;
  } else {
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(tiles[r][c].neighbors>0 ? `${tiles[r][c].neighbors}` : ' ',
      tiles[r][c].cX + (TILEDIM * 0.33) + leftPadding, tiles[r][c].cY + (TILEDIM * 0.66) + topPadding, TILEDIM);
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
    sprite.src = 'img/guySad.png';
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
  if (tile.goalTile) return;
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
  // setTimeout(alert, 250, 'Game over! Close to try again');
  initializeBoardState();
  drawPlayer();
  document.removeEventListener('keydown', keyDownHandler, {once: true});
}

function handleWin() {
  console.log('YOU MADE IT!');
  initializeBoardState();
}
