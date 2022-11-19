let minesNumber = 20;
const boardCellsNumber = 81;
const boardGame = document.getElementById("boardGameCells");
const remainsMinesNumber = document.getElementById("mines").innerHTML = minesNumber;
let gameOver = false;

function generateBoardGame() {
  let uniqueValues = new Set();
  let bombs = [];
  let min = 1, max = boardCellsNumber;

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
}

function setBorder(clickedCellId) {
  for (let i = 0; i < boardCellsNumber; ++i) {
    if (i == clickedCellId) {
      document.getElementById(clickedCellId).style.border = "2px inset #d9d9d9";
    }
  }
}

function elapsedTime() {
  let firstDigit = 0, secondDigit = 0, lastDigit = 0;
  ++lastDigit;
  let time = firstDigit + '' + secondDigit + '' + lastDigit;
  document.getElementById('time').innerText = time;
}
setInterval(elapsedTime(), 1000);

function resetGame() {
  location.reload();
}