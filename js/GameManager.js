let gameBoard;
let numbers;
let choosenCell;
let cells;
let isDraft;
let level;
let neighborsCells = [];
let sameValCells = [];
let validCells = BOARD_SIZE;
let animatedCells = [];

let elapsedTime = 0;
let stopwatchInterval;
let isPaused = false;
let isDarkMode;

let soundOn = true;
const incorrect = new Audio("../sound/error.wav");
const correct = new Audio("../sound/correct-choice.wav");
const areaCompleted = new Audio("../sound/correct-blips.wav");
const winSound = new Audio("../sound/win.mp3");
const deleteSound = new Audio("../sound/del.wav");
setSoundVolume(0.5);

function loadGame() {
  const startScreen = document.querySelector(".start-screen");
  startScreen.style.display = "none";

  gameBoard = new Sudoku(level);
  numbers = createNumbers();
  cells = createCells();
  createGUI();
  chosenCell = null;
  isDraft = false;
  validCells -= EMPTY_CELLS[level];
  document.getElementById("stopwatchContainer").style.display = "inline";
  startStopwatch();
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

    if (i % BOX_SIZE === 0) cellDiv.style["border-left"] = "3px solid black";
    if (Math.floor(i / GRID_SIZE) % BOX_SIZE === 0)
      cellDiv.style["border-top"] = "3px solid black";
    if (i <= 80 && i >= 72) cellDiv.style["border-bottom"] = "3px solid black";
    if (i === right) {
      right += GRID_SIZE;
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

  for (let i = 0; i < GRID_SIZE; i++) {
    numbersCounts.push(0);
  }

  for (let i = 0; i < 81; i++) {
    if (gameBoard.getVal(i) != EMPTY) {
      numbersCounts[gameBoard.getVal(i) - 1]++;
    }
  }

  for (let i = 1; i <= GRID_SIZE; i++) {
    numbers.push(new NumberPanel(i));
    numbers[i - 1].amount = numbersCounts[i - 1];
  }

  return numbers;
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
  if (isMobileOrTablet()) {
    delDiv.setAttribute("class", "number-panel-mobile cmd");
  } else {
    delDiv.setAttribute("class", "number-panel cmd");
  }
  delDiv.onclick = deleteCell;
  delDiv.setAttribute("id", "cmdX");
  numbersDiv.append(delDiv);

  editDiv.innerHTML = "draft";
  if (isMobileOrTablet()) {
    editDiv.setAttribute("class", "number-panel-mobile cmd");
  } else {
    editDiv.setAttribute("class", "number-panel cmd");
  }
  editDiv.setAttribute("id", "cmdDraft");
  editDiv.onclick = clickDraft;
  numbersDiv.append(editDiv);
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

function clickCell(e) {
  let draftDiv = document.getElementById("cmdDraft");
  let index;

  if (isPaused) {
    return;
  }

  choosenCell = e.target;
  index = getCellIndex();
  rowsColumnsNeighbors(index);

  if (isDraft) {
    if (isEmptyCell()) {
      draftDiv.classList.remove("draft-disabled");
    } else {
      draftDiv.classList.add("draft-disabled");
    }
  } else {
    if (choosenCell.textContent.trim()) {
      sameVal(choosenCell.textContent, index);
    }
  }
}

function clearMarks() {
  removeSameVal();
  removeNeighbors();

  neighborsCells = [];
  sameValCells = [];
}

function removeSameVal() {
  sameValCells.forEach((cell) => {
    cell.classList.remove("clicked-same-val");
  });
}

function removeNeighbors() {
  neighborsCells.forEach((cell) => {
    cell.classList.remove("clicked-cell-neighbors");
  });
}

function sameVal(cellVAL, index) {
  let boardDiv = document.getElementsByClassName("board")[0];

  for (let i = 0; i < 81; i++) {
    if (cellVAL == boardDiv.childNodes[i].textContent && index !== i) {
      sameValCells.push(boardDiv.childNodes[i]);
    }
  }

  sameValCells.forEach((cell) => cell.classList.add("clicked-same-val"));
}

function getRow(index) {
  return Math.floor(index / GRID_SIZE);
}

function getColumn(index) {
  return index % GRID_SIZE;
}

function getSquareStartIndex(index) {
  const row = getRow(index);
  const col = getColumn(index);
  return (
    27 * Math.floor(row / BOX_SIZE) + BOX_SIZE * Math.floor(col / BOX_SIZE)
  );
}

function rowsColumnsNeighbors(index) {
  clearMarks();
  let boardDiv = document.getElementsByClassName("board")[0];

  for (let i = 0; i < GRID_SIZE; i++) {
    neighborsCells.push(boardDiv.childNodes[getRow(index) * GRID_SIZE + i]);
    neighborsCells.push(boardDiv.childNodes[i * GRID_SIZE + getColumn(index)]);
  }

  const squareStartIndex = getSquareStartIndex(index);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      neighborsCells.push(
        boardDiv.childNodes[squareStartIndex + i * GRID_SIZE + j]
      );
    }
  }

  const clickedCellIndex = neighborsCells.indexOf(boardDiv.childNodes[index]);
  neighborsCells.forEach((cell) => {
    if (cell !== neighborsCells[clickedCellIndex]) {
      cell.classList.add("clicked-cell-neighbors");
    }
  });
}

function clickNumber(e) {
  let currVal, prevVal, index;

  if (isPaused || choosenCell == null) {
    return;
  }

  if (isDraft) {
    if (isEmptyCell()) {
      toggleDraftCell();
      assignDraft(e.target.firstChild.innerHTML);
    }
  } else {
    toggleDraftCell();
    choosenCell.firstChild.innerHTML = e.target.firstChild.innerHTML;
    index = getCellIndex();
    prevVal = gameBoard.getVal(index);
    gameBoard.setVal(index, parseInt(choosenCell.firstChild.innerHTML));
    currVal = parseInt(e.target.firstChild.innerHTML);

    choosenCell.classList.remove("illegal-cell");
    if (gameBoard.isLegalcell(index) == false) {
      if (prevVal == gameBoard.getCorrectVal(index)) {
        decreaseAmountVal(prevVal);
        validCells--;
      }
      choosenCell.classList.add("illegal-cell");
      if (soundOn) {
        incorrect.play();
      }
    } else {
      if (prevVal != numbers[currVal - 1].val) {
        increaseAmountVal(e, currVal);
        validCells++;

        runCellsAnimation();
        sameVal(numbers[currVal - 1].val, index);

        if (soundOn) {
          correct.play();
        }
      }
    }

    if (validCells == BOARD_SIZE) {
      endGame();
    }
  }
}

function getCellIndex() {
  let boardDiv = document.getElementsByClassName("board")[0];
  for (let i = 0; i < boardDiv.childNodes.length; i++) {
    if (boardDiv.childNodes[i] == choosenCell) {
      return i;
    }
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

function isMobileOrTablet() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  );
}

function isEmptyCell() {
  index = getCellIndex();

  if (gameBoard.getVal(index) == 0) {
    return true;
  } else {
    return false;
  }
}

function endGame() {
  if (soundOn) {
    winSound.play();
  }
  clearInterval(stopwatchInterval);

  const endMsgContainer = document.createElement("div");
  endMsgContainer.classList.add("endmsg-container");

  let endMsg = document.createElement("div");
  endMsg.innerHTML = "<h1>Congratulations! You Solved the Puzzle!</h1>";
  endMsg.classList.add("endmsg");
  endMsgContainer.appendChild(endMsg);

  document.body.appendChild(endMsgContainer);

  document.querySelector(".board").style.display = "none";
  document.querySelector(".numbers").style.display = "none";
  document.querySelector("#stopwatchContainer").style.display = "none";

  setTimeout(function () {
    window.location.href = "sudoku.html";
  }, 3500);

  showConfetti();
}

/*-----------------------------------------------------------------------------------------------------------------------------------------
  ----------------------------------------------------------delete Funcs--------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------------------------*/
function deleteCell(e) {
  let num, index, validNum;
  let draftDiv = document.getElementById("cmdDraft");

  if (choosenCell == null) {
    return;
  }

  draftDiv.classList.remove("draft-disabled");
  choosenCell.classList.remove("illegal-cell");

  if (soundOn) {
    deleteSound.play();
  }

  if (isDraftCell()) {
    clearDrafts();
  } else {
    num = parseInt(choosenCell.firstChild.textContent);
    choosenCell.firstChild.textContent = "";
    index = getCellIndex();
    validNum = gameBoard.isLegalcell(index);
    gameBoard.setVal(index, EMPTY);
    removeSameVal();

    if (!validNum) {
      return;
    }

    decreaseAmountVal(num);
  }
}

/*-----------------------------------------------------------------------------------------------------------------------------------------
  ----------------------------------------------------------draft Funcs--------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------------------------*/
function clickDraft(event) {
  let draftDiv = document.getElementById("cmdDraft");

  if (isDraft) {
    if (isMobileOrTablet()) {
      draftDiv.classList.remove("draft-clicked-mobile");
    } else {
      draftDiv.classList.remove("draft-clicked");
    }
    draftDiv.classList.add("cmd");
    if (choosenCell) {
      if (isEmptyCell()) {
        draftDiv.classList.remove("draft-disabled");
      }

      if (choosenCell.textContent.trim()) {
        sameVal(choosenCell.textContent, index);
      }
    }
  } else {
    draftDiv.classList.remove("cmd");
    if (isMobileOrTablet()) {
      draftDiv.classList.add("draft-clicked-mobile");
    } else {
      draftDiv.classList.add("draft-clicked");
    }

    if (choosenCell) {
      if (!isEmptyCell()) {
        draftDiv.classList.add("draft-disabled");
        removeSameVal();
      } else {
        draftDiv.classList.remove("draft-disabled");
      }
    }
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

  if (numbersTable[num - 1].innerHTML == "") {
    numbersTable[num - 1].innerHTML = num;
  } else {
    numbersTable[num - 1].innerHTML = "";
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

/*-----------------------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------Animation Funcs------------------------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------------------------*/
function runCellsAnimation() {
  let boardDiv = document.getElementsByClassName("board")[0];
  let runAnimFlag =
    checkRowCells(boardDiv) + checkColCells(boardDiv) + checkBoxCells(boardDiv);

  if (runAnimFlag) {
    animateCells();
    setTimeout(clearAnimationClasses, 1300);
    if (soundOn) {
      areaCompleted.play();
    }
  }
}

function checkBoxCells(boardDiv) {
  let boxCells = [];
  index = getCellIndex();
  const squareStartIndex = getSquareStartIndex(index);

  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (gameBoard.getVal(squareStartIndex + i * GRID_SIZE + j) == EMPTY) {
        return false;
      }
      boxCells.push(boardDiv.childNodes[squareStartIndex + i * GRID_SIZE + j]);
    }
  }

  animatedCells = animatedCells.concat(boxCells);
  return true;
}

function checkRowCells(boardDiv) {
  let rowsCells = [];
  index = getCellIndex();

  for (let i = 0; i < GRID_SIZE; i++) {
    if (gameBoard.getVal(getRow(index) * GRID_SIZE + i) == EMPTY) {
      return false;
    }
    rowsCells.push(boardDiv.childNodes[getRow(index) * GRID_SIZE + i]);
  }

  animatedCells = animatedCells.concat(rowsCells);
  return true;
}

function checkColCells(boardDiv) {
  let colsCells = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    if (gameBoard.getVal(i * GRID_SIZE + getColumn(index)) == EMPTY) {
      return false;
    }
    colsCells.push(boardDiv.childNodes[i * GRID_SIZE + getColumn(index)]);
  }

  animatedCells = animatedCells.concat(colsCells);
  return true;
}

function animateCells() {
  for (const cell of animatedCells) {
    cell.classList.add("active-cells-animation");
  }
}

function clearAnimationClasses() {
  animatedCells.forEach((cell) => {
    cell.classList.remove("active-cells-animation");
  });
  animatedCells = [];
}

function showConfetti() {
  const confettiSettings = {
    target: "confetti-canvas",
    max: 80,
    size: 1,
    animate: true,
    props: ["circle", "square", "triangle", "line"],
    colors: [
      [165, 104, 246],
      [230, 61, 135],
      [0, 199, 228],
      [253, 214, 126],
    ],
    clock: 25,
  };

  const confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();
}

/*-----------------------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------EventListener to sound and thememode---------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const speakerIcon = document.getElementById("speakerIcon");
  speakerIcon.addEventListener("click", toggleSound);

  checkThemeMode();
  checkSoundStatus();
});

/*-----------------------------------------------------------------------------------------------------------------------------------------
  -------------------------------------EventListener to close navbar menu in mobile devices---------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  function closeNavbar() {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector("#navbar-collapse");
    navbarCollapse.classList.remove("show");
    navbarToggler.setAttribute("aria-expanded", "false");
  }

  const speakerIcon = document.getElementById("speakerIcon");
  speakerIcon.addEventListener("click", function () {
    setTimeout(closeNavbar, 400);
  });

  const themeModeIcon = document.querySelector(".switch input");
  themeModeIcon.addEventListener("click", function () {
    setTimeout(closeNavbar, 400);
  });
});

/*-----------------------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------------darkmode funcs-------------------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------------------------*/
function toggleThemeMode() {
  isDarkMode = localStorage.getItem("isDarkMode") !== "true";
  localStorage.setItem("isDarkMode", isDarkMode.toString());
  document.documentElement.setAttribute(
    "data-force-color-mode",
    isDarkMode ? "dark" : "light"
  );
  if (window.location.href.includes("sudoku.html")) {
    changeButtonsClass();
  }
}

function checkThemeMode() {
  isDarkMode = localStorage.getItem("isDarkMode") === "true";
  if (isDarkMode) {
    document.documentElement.setAttribute("data-force-color-mode", "dark");
    document.querySelector(".switch input").checked = true;
    if (window.location.href.includes("sudoku.html")) {
      changeButtonsClass();
    }
  } else {
    document.documentElement.setAttribute("data-force-color-mode", "light");
    document.querySelector(".switch input").checked = false;
  }
}

function changeButtonsClass() {
  const buttons = [
    { id: "btnEasy", color: "success" },
    { id: "btnMedium", color: "info" },
    { id: "btnHard", color: "warning" },
    { id: "btnEvil", color: "danger" },
  ];

  buttons.forEach((button) => {
    const btnElement = document.getElementById(button.id);
    if (isDarkMode) {
      btnElement.classList.add(`btn-outline-${button.color}`);
      btnElement.classList.remove(`btn-${button.color}`);
    } else {
      btnElement.classList.remove(`btn-outline-${button.color}`);
      btnElement.classList.add(`btn-${button.color}`);
    }
  });
}

/*-----------------------------------------------------------------------------------------------------------------------------------------
  -----------------------------------------------------------------watch funcs-------------------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const pauseBtn = document.getElementById("pauseBtn");
  if (pauseBtn) {
    pauseBtn.addEventListener("click", pauseStopwatch);
    document
      .getElementById("resumeBtn")
      .addEventListener("click", resumeStopwatch);
  }
});

function startStopwatch() {
  clearInterval(stopwatchInterval);
  updateStopwatchDisplay();
  stopwatchInterval = setInterval(() => {
    if (!isPaused) {
      elapsedTime++;
      updateStopwatchDisplay();
    }
  }, 1000);
}

function updateStopwatchDisplay() {
  const stopwatchDiv = document.getElementById("stopwatch");
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  stopwatchDiv.textContent = formattedTime;
}

function pauseStopwatch() {
  isPaused = true;
  clearInterval(stopwatchInterval);
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("resumeBtn").disabled = false;

  const cellElements = document.querySelectorAll(".cell");

  cellElements.forEach((cell) => {
    cell.classList.add("paused-board");
  });
  clearMarks();
}

function resumeStopwatch() {
  isPaused = false;
  startStopwatch();
  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("resumeBtn").disabled = true;

  const cellElements = document.querySelectorAll(".cell");

  cellElements.forEach((cell) => {
    cell.classList.remove("paused-board");
  });

  index = getCellIndex();
  if (index) {
    rowsColumnsNeighbors(index);
    if (!isEmptyCell()) {
      sameVal(choosenCell.textContent, index);
    }
  }
}
/*-----------------------------------------------------------------------------------------------------------------------------------------
  -----------------------------------------------------------------sound funcs-------------------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------------------------*/
function toggleSound(e) {
  e.preventDefault();
  const speakerIcon = document.getElementById("speakerIcon");
  speakerIcon.classList.toggle("mute");

  soundOn = !soundOn;
  localStorage.setItem("soundOn", soundOn.toString());
}

function checkSoundStatus() {
  soundOn = localStorage.getItem("soundOn") === "true";
  if (!soundOn) {
    const speakerIcon = document.getElementById("speakerIcon");
    speakerIcon.classList.add("mute");
  }
}

function setSoundVolume(volume) {
  incorrect.volume = volume;
  correct.volume = volume;
  areaCompleted.volume = volume;
  winSound.volume = volume;
}
