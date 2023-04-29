let minesNumber = 10, flagsNumber = 10;
const boardCellsNumber = 81;
const boardGame = document.getElementById("boardGameCells");
document.getElementById("mines").innerHTML = minesNumber;
let pressedCells = 0;
let seconds = 0;
let bombs = [];
let gameGrid = [];
let revealedCells = new Set();
let cellsIdWithFlags = new Set();
let defusedBombs = new Set();
var myInterval, rightClickEnabled = true;

function generateMines() {
  // generate randomly the bombs on the board
  let uniqueValues = new Set();
  let min = 1, max = boardCellsNumber;
  // store the id cells which will be set as a bomb into an array which is ascending sorted for a easier iteration through the iteration of the board game 
  while (uniqueValues.size < minesNumber) {
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
  return bombs;
}

function generateBoardGame() {
  // display the time
  document.getElementById('time').innerText = '0' + '0' + seconds;
  generateMines();
  // generate the board game and set the state of cells (safe cell or bomb cell)
  let myBoard = [];
  for (let i = 0; i < boardCellsNumber; ++i) {
    const divsElement = document.createElement("div");
    myBoard[i] = i;
    divsElement.setAttribute('id', i);
    divsElement.setAttribute('class', 'safe');
    divsElement.setAttribute('value', 0);
    for (let j = 0; j < minesNumber; ++j) {
      if (i === bombs[j]) {
        divsElement.setAttribute('class', 'bomb');
        divsElement.setAttribute('value', -1);
        divsElement.style.backgroundColor = 'red';
      }
    }
    divsElement.setAttribute('onclick', 'setBorder(this.id), haveMineInside(this.id)');
    boardGame.appendChild(divsElement);
  }
  // convert the array where the cells id are stored to a 2d array
  for (let i = 0; i < myBoard.length; i += 9) {
    gameGrid.push(myBoard.slice(i, i + 9));
  }
  nearBombs();
}

// handle left click events to the selected cell by the user (aply pressed cell efect to the selected cell)
function setBorder(clickedCellId) {
  let row, col, clickedCell = document.getElementById(clickedCellId);
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
      if (gameGrid[i][j] == clickedCellId) {
        row = i;
        col = j;
        ++pressedCells;
      }
    }
  }
  if (pressedCells === 1) {
    elapsedTime();
  }
  if (clickedCell.getAttribute('value') > 0) {
    revealedCells.add(parseInt(clickedCellId));
    clickedCell.style.border = "2px inset #d9d9d9";
    clickedCell.innerText = document.getElementById(clickedCellId).getAttribute('value');
    if (document.getElementById(clickedCellId).getAttribute('value') > 0) {
      if (parseInt(document.getElementById(clickedCellId).getAttribute('value')) === 1) {
        document.getElementById(clickedCellId).style.color = "blue";
      } else if (parseInt(document.getElementById(clickedCellId).getAttribute('value')) === 2) {
        document.getElementById(clickedCellId).style.color = "green";
      } else if (parseInt(document.getElementById(clickedCellId).getAttribute('value')) === 3) {
        document.getElementById(clickedCellId).style.color = "red";
      } else if (parseInt(document.getElementById(clickedCellId).getAttribute('value')) === 4) {
        document.getElementById(clickedCellId).style.color = "brown";
      }
    }
  }
  reveallCells(row, col);
  checkWin();
}

let coada = [];
function reveallCells(row, col) {
  let cellRow, cellColum;
  if (parseInt(document.getElementById(gameGrid[row][col]).getAttribute('value')) === 0 && document.getElementById(gameGrid[row][col]).classList.contains("visited") === false) {
    document.getElementById(gameGrid[row][col]).setAttribute('class', 'visited');
    coada.push(gameGrid[row][col]);
    checkAdjacentCells(row, col);
  }
  while (coada.length > 0) {
    let currentCell = coada.shift();
    for (let i = 0; i < 9; ++i) {
      for (let j = 0; j < 9; ++j) {
        if (gameGrid[i][j] === currentCell) {
          cellRow = i;
          cellColum = j;
        }
      }
    }
    checkAdjacentCells(cellRow, cellColum);
    document.getElementById(currentCell).style.border = "2px inset #d9d9d9";
  }
  return row, col;
}

function checkAdjacentCells(r, c) {
  for (let i = r - 1; i <= r + 1; ++i) {
    for (let j = c - 1; j <= c + 1; ++j) {
      if (i >= 0 && i < 9 && j >= 0 && j < 9) {
        let neighboursBombsNumber = parseInt(document.getElementById(gameGrid[i][j]).getAttribute('value'));
        if (neighboursBombsNumber === 0 && document.getElementById(gameGrid[i][j]).classList.contains("visited") === false) {
          document.getElementById(gameGrid[i][j]).setAttribute('class', 'visited');
          coada.push(gameGrid[i][j]);
        } else if (neighboursBombsNumber > 0) {
          document.getElementById(gameGrid[i][j]).style.border = "2px inset #d9d9d9";
          document.getElementById(gameGrid[i][j]).innerText = neighboursBombsNumber;
          if (neighboursBombsNumber === 1) {
            document.getElementById(gameGrid[i][j]).style.color = "blue";
          } else if (neighboursBombsNumber === 2) {
            document.getElementById(gameGrid[i][j]).style.color = "green";
          } else if (neighboursBombsNumber === 3) {
            document.getElementById(gameGrid[i][j]).style.color = "red";
          } else if (neighboursBombsNumber === 4) {
            document.getElementById(gameGrid[i][j]).style.color = "brown";
          }
        }
      }
    }
  }
}

function haveMineInside(clickedCellIds) {
  // check if the selected cell contain a bomb
  let clickedCell = document.getElementById(clickedCellIds);
  let clickedCellType = clickedCell.getAttribute('class');
  if (clickedCellType === 'bomb') {
    document.getElementById('resetGameIcon').style.backgroundImage = "url('deadSmile.png')";
    clearInterval(myInterval);
    for (let j = 0; j < minesNumber; ++j) {
      for (let i = 0; i < boardCellsNumber; ++i) {
        var cell = document.getElementById(i);
        if (i === bombs[j]) {
          cell.style.background = "#808080 url('mine.png') no-repeat center";
          cell.style.border = "#d9d9d9 inset 2px";
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
if (rightClickEnabled === true) {
  boardGame.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    const rightClickedCell = document.getElementById(ev.target.id);
    const rightClickedCellType = document.getElementById(ev.target.id).getAttribute("class");
    if (cellsIdWithFlags.has(ev.target.id) === false && ev.target.id !== 'boardGameCells' && revealedCells.has(parseInt(ev.target.id)) === false) {
      cellsIdWithFlags.add(ev.target.id);
      rightClickedCell.style.background = '#d9d9d9 url(flag.png) no-repeat center';
      if (flagsNumber > 0) {
        --flagsNumber;
      }
      if (rightClickedCellType == "bomb") {
        defusedBombs.add(ev.target.id);
      }
    } else if (revealedCells.has(parseInt(ev.target.id)) === false) {
      cellsIdWithFlags.delete(ev.target.id);
      rightClickedCell.style.backgroundImage = 'none';
      ++flagsNumber;
    }
    document.getElementById("mines").innerHTML = flagsNumber;
    checkWin();
  }, false);
}

function checkWin() {
  if ((defusedBombs.size === bombs.length && flagsNumber === 0) || revealedCells.size === 71) {
    for (let i = 0; i < boardCellsNumber; ++i) {
      const everyCell = document.getElementById(i);
      everyCell.style.pointerEvents = 'none';
    }
    rightClickEnabled = false;
    boardGame.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
    });
    document.getElementById('header').innerText = 'Game Won!';
    clearInterval(myInterval);
  }
  console.log(revealedCells.size)
}

function nearBombs() {
  let rows = 9, columns = 9;
  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < columns; ++j) {
      let counter = 0;
      if (i > 0 && i < 8 && j > 0 && j < 8) {
        if (document.getElementById(gameGrid[i][j]).getAttribute("class") == 'safe') {
          if (document.getElementById(gameGrid[i - 1][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i - 1][j]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i - 1][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i + 1][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i + 1][j]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i + 1][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          document.getElementById(gameGrid[i][j]).setAttribute("value", counter);
        }
      }
      if (i === 0) {
        if (document.getElementById(gameGrid[i][j]).getAttribute("class") == 'safe') {
          if (j < 8 && document.getElementById(gameGrid[i][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (j < 8 && document.getElementById(gameGrid[i + 1][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i + 1][j]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (j > 0 && document.getElementById(gameGrid[i + 1][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (j > 0 && document.getElementById(gameGrid[i][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          document.getElementById(gameGrid[i][j]).setAttribute("value", counter);
        }
      }
      if (j === 8) {
        if (document.getElementById(gameGrid[i][j]).getAttribute("class") == 'safe') {
          if (document.getElementById(gameGrid[i][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (i < 8 && document.getElementById(gameGrid[i + 1][j]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (i > 0 && document.getElementById(gameGrid[i - 1][j]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (i > 0 && document.getElementById(gameGrid[i - 1][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (i < 8 && document.getElementById(gameGrid[i + 1][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          document.getElementById(gameGrid[i][j]).setAttribute("value", counter);
        }
      }
      if (i === 8) {
        if (document.getElementById(gameGrid[i][j]).getAttribute("class") == 'safe') {
          if (j > 0 && document.getElementById(gameGrid[i - 1][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i - 1][j]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (j < 8 && document.getElementById(gameGrid[i - 1][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (j < 8 && document.getElementById(gameGrid[i][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (j > 0 && document.getElementById(gameGrid[i][j - 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          document.getElementById(gameGrid[i][j]).setAttribute("value", counter);
        }
      }
      if (j === 0) {
        if (document.getElementById(gameGrid[i][j]).getAttribute("class") == 'safe') {
          if (i > 0 && document.getElementById(gameGrid[i - 1][j]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (i > 0 && document.getElementById(gameGrid[i - 1][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (document.getElementById(gameGrid[i][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (i < 8 && document.getElementById(gameGrid[i + 1][j + 1]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          if (i < 8 && document.getElementById(gameGrid[i + 1][j]).getAttribute("class") == 'bomb') {
            ++counter;
          }
          document.getElementById(gameGrid[i][j]).setAttribute("value", counter);
        }
      }
    }
  }
}

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