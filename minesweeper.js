let minesNumber = 10, flagsNumber = 10;
const boardCellsNumber = 81;
const boardGame = document.getElementById("boardGameCells");
document.getElementById("mines").innerHTML = minesNumber;
let pressedCells = 0;
let seconds = 0;
let bombs = [];
let cellsIdWithFlags = new Set();
var myInterval;

function generateBoardGame() {
  // generate randomly the bombs on the board
  let uniqueValues = new Set();
  let min = 1, max = boardCellsNumber;
  document.getElementById('time').innerText = '0' + '0' + seconds;
  // store the id cells which will be set as a bomb into an array which is ascending sorted for a easier iteration through the iteration of the board game 
  while(uniqueValues.size < minesNumber) {
    uniqueValues.add(Math.floor(Math.random() * (max - min + min) + min));
  }
  bombs = Array.from(uniqueValues).sort((a, b) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0;
  });
  // generate the board game and set the state of cells (safe cell or bomb cell)
  let myBoard = [];
  for (let i = 0; i < boardCellsNumber; ++i) {
    const divsElement = document.createElement("div");
    myBoard[i] = i;
    divsElement.setAttribute('id', i);
    divsElement.setAttribute('class', 'safe');
    for (let j = 0; j < 20; ++j) {
      if (i === bombs[j]) {
        divsElement.setAttribute('class', 'bomb');
        divsElement.style.backgroundColor = 'red';
      }
    }
    divsElement.setAttribute('onclick', 'setBorder(this.id)');
    boardGame.appendChild(divsElement);
  }
  // convert the array where the cells id are stored to a 2d array
  let gameGrid = [];
  for(let i = 0; i < myBoard.length; i += 9) {
    gameGrid.push(myBoard.slice(i, i + 9));
  }
  console.log(gameGrid[0][9]);
  for (let m = 0; m < bombs.length; ++m) {
    for (let l = 0; l < gameGrid.length; ++l) {
      for (let c = 0; c < gameGrid.length; ++c) {
        var iteratedCellClass = document.getElementById(gameGrid[l][c]).getAttribute('class');
        if (bombs[m] === gameGrid[l][c]) {
          console.log(bombs[m] + " " + gameGrid[l][c] + " " + l + " " + c);
          let iteratedCells = 0;
          // bomb that are not on the edge of the game grid
          if ((l > 0 && c < 8) && (l < 8 && c > 0)) {
            let startLine = l - 1, endLine = l + 2, startColumn = c - 1, endColumn = c + 2;
            while (iteratedCells < 8) {
              for (let j = startColumn; j < endColumn; ++j) {
                iteratedCellClass = document.getElementById(gameGrid[startLine][j]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[startLine][j]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let i = startLine + 1; i < endLine; ++i) {
                iteratedCellClass = document.getElementById(gameGrid[i][endColumn - 1]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[i][endColumn - 1]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let k = endColumn - 2; k > startColumn - 1; --k) {
                iteratedCellClass = document.getElementById(gameGrid[endLine - 1][k]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[endLine - 1][k]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let l = endLine - 2; l > startLine; --l) {
                iteratedCellClass = document.getElementById(gameGrid[l][startColumn]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[l][startColumn]).innerText = '1';
                }
                ++iteratedCells;
              }
            }
          }
          // bomb that are on the top edge of the game grid
          if ((l === 0 && c > 0) && (l === 0 && c < 8)) {
            startLine = 0, endLine = l + 2, startColumn = c - 1, endColumn = c + 2;
            while (iteratedCells < 6) {
              for (let i = startLine; i < endLine; ++i) {
                iteratedCellClass = document.getElementById(gameGrid[i][endColumn - 1]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[i][endColumn - 1]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let k = endColumn - 2; k > startColumn - 1; --k) {
                iteratedCellClass = document.getElementById(gameGrid[endLine - 1][k]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[endLine - 1][k]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let l = endLine - 2; l > startLine - 1; --l) {
                iteratedCellClass = document.getElementById(gameGrid[l][startColumn]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[l][startColumn]).innerText = '1';
                }
                ++iteratedCells;
              }
            }
          }
          // bomb that are on the bottom edge of the game grid 
          if ((l === 8 && c > 0) && (l === 8 && c < 8)) {
            startLine = l - 1, endLine = l + 2, startColumn = c - 1, endColumn = c + 2;
            while (iteratedCells < 6) {
              for (let j = startColumn; j < endColumn; ++j) {
                iteratedCellClass = document.getElementById(gameGrid[startLine][j]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[startLine][j]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let i = startLine; i < endLine - 1; ++i) {
                iteratedCellClass = document.getElementById(gameGrid[i][endColumn - 1]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[i][endColumn - 1]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let l = endLine - 2; l > startLine; --l) {
                iteratedCellClass = document.getElementById(gameGrid[l][startColumn]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[l][startColumn]).innerText = '1';
                }
                ++iteratedCells;
              }
            }
          }
          // bomb that are on the right edge of the game grid 
          if ((c === 8 && l > 0) && ( c === 8 && l < 8)) {
            startLine = l - 1, endLine = l + 2, startColumn = c - 1, endColumn = c + 1;
            while (iteratedCells < 6) {
              for (let j = startColumn; j < endColumn; ++j) {
                iteratedCellClass = document.getElementById(gameGrid[startLine][j]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[startLine][j]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let k = endColumn - 1; k > startColumn - 1; --k) {
                iteratedCellClass = document.getElementById(gameGrid[endLine - 1][k]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[endLine - 1][k]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let l = endLine - 2; l > startLine; --l) {
                iteratedCellClass = document.getElementById(gameGrid[l][startColumn]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[l][startColumn]).innerText = '1';
                }
                ++iteratedCells;
              }
            }
          }
          // bomb that are on the left edge of the game grid 
          if ((c === 0 && l > 0) && (c === 0 && l < 8)) {
            startLine = l - 1, endLine = l + 2, startColumn = c, endColumn = c + 2;
            while (iteratedCells < 6) {
              for (let j = startColumn; j < endColumn; ++j) {
                iteratedCellClass = document.getElementById(gameGrid[startLine][j]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[startLine][j]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let i = startLine + 1; i < endLine; ++i) {
                iteratedCellClass = document.getElementById(gameGrid[i][endColumn - 1]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[i][endColumn - 1]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let k = endColumn - 1; k > startColumn - 1; --k) {
                iteratedCellClass = document.getElementById(gameGrid[endLine - 1][k]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[endLine - 1][k]).innerText = '1';
                }
                ++iteratedCells;
              }
            }
          }
          // bomb that are on the top left corner of the game grid
          if (l === 0 && c === 0) {
            startLine = l, endLine = l + 2, startColumn = c, endColumn = c + 2;
            while (iteratedCells < 4) {
              for (let i = startLine; i < endLine; ++i) {
                iteratedCellClass = document.getElementById(gameGrid[i][endColumn - 1]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[i][endColumn - 1]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let k = endColumn - 2; k > startColumn - 1; --k) {
                iteratedCellClass = document.getElementById(gameGrid[endLine - 1][k]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[endLine - 1][k]).innerText = '1';
                }
                ++iteratedCells;
              }
            }
          }
          // bomb that are on the top right corner of the game grid
          if (l === 0 && c === 8) {
            startLine = l, endLine = l + 2, startColumn = c - 1, endColumn = c;
            while (iteratedCells < 4) {
              for (let l = endLine - 2; l > startLine - 1; --l) {
                iteratedCellClass = document.getElementById(gameGrid[l][startColumn]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[l][startColumn]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let k = endColumn; k > startColumn - 1; --k) {
                iteratedCellClass = document.getElementById(gameGrid[endLine - 1][k]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[endLine - 1][k]).innerText = '1';
                }
                ++iteratedCells;
              }
            }
          }
          // bomb that are on the bottom left corner of the game grid
          if (l === 8 && c === 0) {
            let startLine = l - 1, endLine = l + 1, startColumn = c, endColumn = c + 2;
            while (iteratedCells < 8) {
              for (let j = startColumn; j < endColumn; ++j) {
                iteratedCellClass = document.getElementById(gameGrid[startLine][j]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[startLine][j]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let i = startLine + 1; i < endLine; ++i) {
                iteratedCellClass = document.getElementById(gameGrid[i][endColumn - 1]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[i][endColumn - 1]).innerText = '1';
                }
                ++iteratedCells;
              }
            }
          }
          // bomb that are on the bottom right corner of the game grid
          if (l === 8 && c === 8) {
            let startLine = l - 1, endLine = l, startColumn = c - 1, endColumn = c + 1;
            while (iteratedCells < 8) {
              for (let j = startColumn; j < endColumn; ++j) {
                iteratedCellClass = document.getElementById(gameGrid[startLine][j]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[startLine][j]).innerText = '1';
                }
                ++iteratedCells;
              }

              for (let l = endLine; l > startLine; --l) {
                iteratedCellClass = document.getElementById(gameGrid[l][startColumn]).getAttribute('class');
                if (iteratedCellClass != 'bomb') {
                  document.getElementById(gameGrid[l][startColumn]).innerText = '1';
                }
                ++iteratedCells;
              }
            }
          }
        }
      }
    }
  }
}

// handle left click events to the selected cell by the user (aply pressed cell efect to the selected cell)
function setBorder(clickedCellId) {
  let clickedCell = document.getElementById(clickedCellId);
  let clickedCellType = clickedCell.getAttribute('class');
  for (let i = 0; i < boardCellsNumber; ++i) {
    if (i == clickedCellId) {
      ++pressedCells;
      document.getElementById(clickedCellId).style.border = "2px inset #d9d9d9";
    }
  }
  if (pressedCells === 1) {
    elapsedTime();
  }
  
  // check if the selected cell contain a bomb
  if (clickedCellType === 'bomb') {
    document.getElementById('resetGameIcon').style.backgroundImage = "url('deadSmile.png')";
    clearInterval(myInterval);
    for (let j = 0; j < 20; ++j) {
      for (let i = 0; i < boardCellsNumber; ++i) {
        const cell = document.getElementById(i);
        if (i === bombs[j]) {
          cell.style.backgroundColor = 'gray';
          cell.style.backgroundImage = "url('mine.png')";
          cell.style.backgroundRepeat = "no-repeat";
          cell.style.backgroundPosition = "center";
          cell.style.border = "2px inset #d9d9d9";
          cell.style.pointerEvents = 'none';
        }
      }
    }
    clickedCell.style.backgroundColor = 'red';
    for (let i = 0; i < boardCellsNumber; ++i) {
      const everyCell = document.getElementById(i);
      everyCell.style.pointerEvents = 'none';
    }
    document.getElementById('header').innerText = 'Game Over!';
  }
}

// handle right click events on cells (set flag to the selected cell)
boardGame.addEventListener('contextmenu', (ev) => {
  ev.preventDefault();
  const rightClickedCell = document.getElementById(ev.target.id);
  let rightClickedCellType = rightClickedCell.getAttribute('class');
  if (flagsNumber >= 0) {
    if (cellsIdWithFlags.has(ev.target.id) === false && ev.target.id !== 'boardGameCells') {
      cellsIdWithFlags.add(ev.target.id);
      rightClickedCell.style.backgroundImage ='url(flag.png)';
      rightClickedCell.style.backgroundRepeat = "no-repeat";
      rightClickedCell.style.backgroundPosition = "center";
      if (rightClickedCellType === 'bomb') {
        --minesNumber;
        --flagsNumber;
      }
    } else {
      cellsIdWithFlags.delete(ev.target.id);
      rightClickedCell.style.backgroundImage = 'none';
      if (rightClickedCellType === 'bomb') {
        ++minesNumber;
        ++flagsNumber;
      }
    }
    document.getElementById("mines").innerHTML = minesNumber;
  }
}, false);

// handle the time functionality
function elapsedTime() {
  myInterval = setInterval(() => {
    ++seconds;

    if (seconds < 10) {
      seconds = '00' + seconds;
    } else if (seconds < 100) {
      seconds = '0' + seconds;
    }

    document.getElementById('time').innerText = seconds;
  }, 1000);
}

function resetGame() {
  location.reload();
}
