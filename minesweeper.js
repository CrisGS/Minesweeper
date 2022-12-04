let minesNumber = 10, flagsNumber = 10;
const boardCellsNumber = 81;
const boardGame = document.getElementById("boardGameCells");
const remainsFlagsNumber = document.getElementById("mines").innerHTML = flagsNumber;
let pressedCells = 0;
let seconds = 0;
let bombs = [];
let cellsIdWithFlags = [];
var myInterval;

function generateBoardGame() {
  let uniqueValues = new Set();
  let min = 1, max = boardCellsNumber;
  document.getElementById('time').innerText = '0' + '0' + seconds;

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

function setBorder(clickedCellId) {
  let clickedCell = document.getElementById(clickedCellId);
  let clickedCellType = clickedCell.getAttribute('class');
  console.log(clickedCellType);
  for (let i = 0; i < boardCellsNumber; ++i) {
    if (i == clickedCellId) {
      ++pressedCells;
      document.getElementById(clickedCellId).style.border = "2px inset #d9d9d9";
    }
  }
  if (pressedCells === 1) {
    elapsedTime();
  }

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
  }
}

boardGame.addEventListener('contextmenu', (ev) => {
  ev.preventDefault();
  console.log(cellsIdWithFlags);
  let alreadyMarked = false;
  for (let i = 0; i < cellsIdWithFlags.length; ++i) {
    if (cellsIdWithFlags[i] == ev.target.id) {
      alreadyMarked = true;
    }
  }
  if (alreadyMarked == false) {
    cellsIdWithFlags.push(ev.target.id);
    rightClickedCell = document.getElementById(ev.target.id);
    rightClickedCell.style.backgroundImage ='url(flag.png)';
    rightClickedCell.style.backgroundRepeat = "no-repeat";
    rightClickedCell.style.backgroundPosition = "center";
    --flagsNumber;
  }
  document.getElementById("mines").innerHTML = flagsNumber;
}, false);

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
