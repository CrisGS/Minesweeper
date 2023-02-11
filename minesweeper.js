let minesNumber = 10, flagsNumber = 10;
const boardCellsNumber = 81;
const boardGame = document.getElementById("boardGameCells");
document.getElementById("mines").innerHTML = minesNumber;
let pressedCells = 0;
let seconds = 0;
let bombs = [];
let gameGrid = [];
let cellsIdWithFlags = new Set();
var myInterval;

function generateMines() {
  // generate randomly the bombs on the board
  let uniqueValues = new Set();
  let min = 1, max = boardCellsNumber;
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
  return bombs;
}

function generateBoardGame() {
  // display the time
  document.getElementById('time').innerText = '0' + '0' + seconds;
  generateMines();
  console.log(generateMines());
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
    divsElement.setAttribute('value', 0);
    divsElement.setAttribute('onclick', 'setBorder(this.id), haveMineInside(this.id)');
    boardGame.appendChild(divsElement);
  }
  // convert the array where the cells id are stored to a 2d array
  for(let i = 0; i < myBoard.length; i += 9) {
    gameGrid.push(myBoard.slice(i, i + 9));
  }
  nearBombs();
}

// handle left click events to the selected cell by the user (aply pressed cell efect to the selected cell)
function setBorder(clickedCellId) {
  for (let i = 0; i < boardCellsNumber; ++i) {
    if (i == clickedCellId) {
      ++pressedCells;
      document.getElementById(clickedCellId).style.border = "2px inset #d9d9d9";
    }
  }
  if (pressedCells === 1) {
    elapsedTime();
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

function nearBombs() {
  for (let i = 0; i < 9; ++i) {
    for (let j = 0; j < 9; ++j) {
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
      console.log(gameGrid[i][j] + ' ' + document.getElementById(gameGrid[i][j]).getAttribute("value"));
      if (document.getElementById(gameGrid[i][j]).getAttribute("class") == 'safe' && document.getElementById(gameGrid[i][j]).getAttribute("value") != 0) {
        document.getElementById(gameGrid[i][j]).innerText = document.getElementById(gameGrid[i][j]).getAttribute("value");
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
