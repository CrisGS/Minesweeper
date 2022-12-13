let minesNumber = 20, flagsNumber = 20;
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
  for (let i = 0; i < boardCellsNumber; ++i) {
    const divsElement = document.createElement("div");
    divsElement.setAttribute('id', i);
    divsElement.setAttribute('class', 'safe');
    divsElement.setAttribute('disabled', 'false');
    for (let j = 0; j < 20; ++j) {
      if (i === bombs[j]) {
        divsElement.setAttribute('class', 'bomb');
        divsElement.style.backgroundColor = 'red';
      }
    }
    divsElement.setAttribute('onclick', 'setBorder(this.id)');
    boardGame.appendChild(divsElement);
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
          document.getElementById('header').innerText = 'GAME OVER!';
        }
      }
    }
    clickedCell.style.backgroundColor = 'red';
    for (let i = 0; i < boardCellsNumber; ++i) {
      const everyCell = document.getElementById(i);
      everyCell.style.pointerEvents = 'none';
    }
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
