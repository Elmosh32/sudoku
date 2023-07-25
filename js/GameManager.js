let gameBoard;
let numbers;
let choosenCell;
let cells;
let isDraft;
let level;
let neighborsCell = [];
let isDarkMode = false;

function loadGame() {
  const startScreen = document.querySelector(".start-screen");
  startScreen.style.display = "none";

  gameBoard = new Sudoku(level);
  numbers = createNumbers();
  cells = createCells();
  createGUI();
  chosenCell = null;
  isDraft = false;
}

function clickStart() {
  const rdo = document.querySelector('input[name="options"]:checked');
  const difficulty = document.querySelector(
    "label[for=" + rdo.id + "]"
  ).innerHTML;

  switch (difficulty) {
    case "Easy":
      level = EASY;
      break;
    case "Medium":
      level = MEDIUM;
      break;
    case "Hard":
      level = HARD;
      break;
    case "Evil":
      level = EVIL;
      break;
  }

  loadGame();
}

function createGUI() {
  createBoard();
  createNumbersPanel();
}

function createBoard() {
  var right = 8;
  const boardDiv = document.querySelector(".board");

  cells.forEach((cell, i) => {
    const cellDiv = cell.render();

    if (i % 3 === 0) cellDiv.style["border-left"] = "3px solid black";
    if (Math.floor(i / 9) % 3 === 0)
      cellDiv.style["border-top"] = "3px solid black";
    if (i <= 80 && i >= 72) cellDiv.style["border-bottom"] = "3px solid black";
    if (i === right) {
      right += 9;
      cellDiv.style["border-right"] = "3px solid black";
    }

    cellDiv.addEventListener("click", clickCell);
    boardDiv.append(cellDiv);
  });

  boardDiv.childNodes.forEach((cell, i) => {
    if (gameBoard.getVal(i) === EMPTY) {
      cell.firstChild.innerHTML = " ";
    }
  });
}

function createNumbers() {
  numbers = [];
  let numbersCounts = [];

  for (let i = 0; i < 9; i++) {
    numbersCounts.push(0);
  }

  for (let i = 0; i < 81; i++) {
    if (gameBoard.getVal(i) != EMPTY) numbersCounts[gameBoard.getVal(i) - 1]++;
  }

  for (let i = 1; i <= 9; i++) {
    numbers.push(new NumberB(i));
    numbers[i - 1].amount = numbersCounts[i - 1];
  }

  return numbers;
}

function createCells() {
  let res = [];

  for (let i = 0; i < 81; i++) {
    res.push(new Cell(gameBoard.getVal(i)));
    if (gameBoard.getVal(i) != EMPTY) {
      res[i].isFixed = true;
    }
  }

  return res;
}

function createNumbersPanel() {
  let numbersDiv = document.getElementsByClassName("numbers")[0];
  let delDiv = document.createElement("div");
  let editDiv = document.createElement("div");

  numbers.forEach((n) => {
    let numDiv = n.render();
    numDiv.onclick = clickNumber;
    numbersDiv.append(numDiv);
  });

  delDiv.innerHTML = "delete";
  delDiv.setAttribute("class", "number-panel cmd");
  delDiv.onclick = deleteCell;
  delDiv.setAttribute("id", "cmdX");
  numbersDiv.append(delDiv);

  editDiv.innerHTML = "draft";
  editDiv.setAttribute("class", "number-panel cmd");
  editDiv.setAttribute("id", "cmdDraft");
  editDiv.onclick = clickDraft;
  numbersDiv.append(editDiv);
}

function clickCell(e) {
  let draftDiv = document.getElementById("cmdDraft");
  choosenCell = e.target;
  if (choosenCell != null) {
    for (let i = 0; i < 28; i++) {
      if (neighborsCell[i] == null) break;

      neighborsCell[i].classList.remove("clicked-cell-neighbors");
      neighborsCell[i].classList.remove("clicked-same-val");
    }
  }

  let index = getCellIndex();
  getSquareStartIndex(index);
  rowsColumnsNeighbors(index);

  if (isEmptyCell()) {
    draftDiv.classList.remove("draft-disabled");
  } else {
    draftDiv.classList.add("draft-disabled");
  }

  if (choosenCell.textContent != " ") {
    sameVal(choosenCell.textContent, index);
  }
}

function clearMarks() {
  neighborsCell.forEach((cell) => {
    cell.classList.remove("clicked-same-val", "clicked-cell-neighbors");
  });
  neighborsCell = [];
}

function sameVal(cellVAL, index) {
  // clearMarks();
  let boardDiv = document.getElementsByClassName("board")[0];

  for (let i = 0; i < 81; i++) {
    if (cellVAL == boardDiv.childNodes[i].textContent && index !== i) {
      neighborsCell.push(boardDiv.childNodes[i]);
    }
  }

  neighborsCell.forEach((cell) => cell.classList.add("clicked-same-val"));
}

function getRow(index) {
  return Math.floor(index / 9);
}

function getColumn(index) {
  return index % 9;
}

function getSquareStartIndex(index) {
  const row = getRow(index);
  const col = getColumn(index);
  return 27 * Math.floor(row / 3) + 3 * Math.floor(col / 3);
}

function rowsColumnsNeighbors(index) {
  clearMarks();
  let boardDiv = document.getElementsByClassName("board")[0];

  for (let i = 0; i < 9; i++) {
    neighborsCell.push(boardDiv.childNodes[getRow(index) * 9 + i]);
    neighborsCell.push(boardDiv.childNodes[i * 9 + getColumn(index)]);
  }

  const squareStartIndex = getSquareStartIndex(index);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      neighborsCell.push(boardDiv.childNodes[squareStartIndex + i * 9 + j]);
    }
  }

  neighborsCell.forEach((cell) => cell.classList.add("clicked-cell-neighbors"));
}

function clickNumber(e) {
  let index;
  let indx;
  let prev;
  // choosenCell = e.target;

  if (choosenCell == null) {
    return;
  }

  choosenCell.classList.remove("clicked-cell");
  if (isDraft) {
    if (isEmptyCell()) {
      toggleDraftCell();
      assignDraft(e.target.firstChild.innerHTML);
    }
  } else {
    toggleDraftCell();
    choosenCell.firstChild.innerHTML = e.target.firstChild.innerHTML;
    index = getCellIndex();
    prev = gameBoard.getVal(index);
    gameBoard.setVal(index, parseInt(choosenCell.firstChild.innerHTML));
    index = parseInt(e.target.firstChild.innerHTML);

    indx = getCellIndex();
    choosenCell.classList.remove("illegal-cell");
    if (gameBoard.isLegalcell(indx) == false) {
      if (prev == gameBoard.getCorrectVal(indx)) {
        decreaseAmountVal(prev);
      }
      choosenCell.classList.add("illegal-cell");
    } else {
      if (prev != numbers[index - 1].val) {
        increaseAmountVal(e, index);
        sameVal(numbers[index - 1].val, indx);
      }
    }

    if (gameBoard.done()) {
      endGame();
    }
  }

  // choosenCell = null;
}

function getCellIndex() {
  let boardDiv = document.getElementsByClassName("board")[0];
  for (let i = 0; i < boardDiv.childNodes.length; i++) {
    if (boardDiv.childNodes[i] == choosenCell) {
      return i;
    }
  }
}

function deleteCell(e) {
  let num;
  let index;
  let correctNum;

  if (choosenCell == null) {
    return;
  }

  choosenCell.classList.remove("clicked-cell");
  choosenCell.classList.remove("illegal-cell");

  if (isDraftCell()) {
    clearDrafts();
  } else {
    num = parseInt(choosenCell.firstChild.textContent);
    choosenCell.firstChild.textContent = "";
    index = getCellIndex();
    correctNum = gameBoard.isLegalcell(index);
    gameBoard.setVal(index, EMPTY);

    if (!correctNum) {
      return;
    }

    decreaseAmountVal(num);
  }
}

function decreaseAmountVal(num) {
  document.getElementsByClassName("numbers")[0].childNodes.forEach((n) => {
    if (n.firstChild.innerHTML == num) {
      numbers[num - 1].decreaseAmount();
      n.lastChild.innerHTML = numbers[num - 1].amount;
    }
  });
}

function increaseAmountVal(e, index) {
  numbers[index - 1].increaseAmount();
  e.target.lastChild.innerHTML = numbers[index - 1].amount;
}

function toggleThemeMode() {
  document.documentElement.setAttribute(
    "data-force-color-mode",
    isDarkMode ? "light" : "dark"
  );
  isDarkMode = !isDarkMode;
}

function clickDraft() {
  let draftDiv = document.getElementById("cmdDraft");

  if (isDraft) {
    draftDiv.classList.remove("draft-clicked");
    draftDiv.classList.add("cmd");
    if (isEmptyCell()) {
      draftDiv.classList.remove("draft-disabled");
    }
  } else {
    draftDiv.classList.remove("cmd");
    draftDiv.classList.add("draft-clicked");
  }
  isDraft = !isDraft;
}

function toggleDraftCell() {
  if (isDraft) {
    choosenCell.firstChild.style.diplay = "none";
    choosenCell.lastChild.style.display = "block";
  } else {
    choosenCell.firstChild.style.diplay = "block";
    choosenCell.lastChild.style.display = "none";
  }
}

function assignDraft(num) {
  let numbersTable = choosenCell.lastChild.getElementsByTagName("td");
  let numInt = parseInt(num);
  let i = 0;

  for (let count = 1; i < numbersTable.length; i++, count++) {
    if (count == numInt) {
      break;
    }
  }

  if (numbersTable[i].innerHTML == "") {
    numbersTable[i].innerHTML = num;
  } else {
    numbersTable[i].innerHTML = "";
  }
}

function isEmptyCell() {
  index = getCellIndex();
  if (gameBoard.getVal(index) == 0) {
    return true;
  } else {
    return false;
  }
}
function isDraftCell() {
  return choosenCell.lastChild.style.display == "block";
}

function clearDrafts() {
  let numbersTable = choosenCell.lastChild.getElementsByTagName("td");

  for (let i = 0; i < numbersTable.length; i++) {
    numbersTable[i].innerHTML = "";
  }
}

function endGame() {
  let endMsg = document.createElement("div");

  endMsg.innerHTML = "<h1>Success!</h1>";
  endMsg.classList.add("endmsg");
  document.body.append(endMsg);
  document.getElementsByClassName("board")[0].style["pointer-events"] = "none";
  document.getElementsByClassName("numbers")[0].style["pointer-events"] =
    "none";
}
