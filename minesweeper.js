let minesNumber = 20;
const boardCellsNumber = 81;
const boardGame = document.getElementById("boardGameCells");
const remainsMinesNumber = document.getElementById("mines").innerHTML = minesNumber;
let gameOver = true;
let seconds = 0;

function generateBoardGame() {
  let uniqueValues = new Set();
  let bombs = [];
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
    divsElement.style.backgroundColor = 'yellow';
    for (let j = 0; j < 20; ++j) {
      if (i === bombs[j]) {
        console.log(i + ' ' + bombs[j]);
        divsElement.setAttribute('class', 'bomb');
        divsElement.style.backgroundColor = 'red';
      }
    }
    divsElement.setAttribute('onclick', 'setBorder(this.id)');
    boardGame.appendChild(divsElement);
  }

  elapsedTime();
}

function setBorder(clickedCellId) {
  for (let i = 0; i < boardCellsNumber; ++i) {
    if (i == clickedCellId) {
      document.getElementById(clickedCellId).style.border = "2px inset #d9d9d9";
    }
  }
}

function elapsedTime() {
  setInterval(() => {
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
