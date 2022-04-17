let gameBoard;
let numbers;
let choosenCell;
let cells;
let isDraft;
let level;
let neighborsCell = [];


function loadGame() {
  document.getElementsByClassName("start-screen")[0].style.display = "none";
  gameBoard = new Sudoku(level);
  numbers = createNumbers();
  cells = createCells();
  createGUI();
  choosenCell = null;
  isDraft = false;
}


function clickStart() {
  let rdo = document.querySelector('input[name="options"]:checked');
  let difficulty = document.querySelector('label[for=' + rdo.id + ']').innerHTML;

  if (difficulty == "Easy")
    level = EASY;
  else if (difficulty == "Medium")
    level = MEDIUM;
  else if (difficulty == "Hard")
    level = HARD;
  else if (difficulty == "Evil")
    level = EVIL;

  loadGame();
}


function createGUI() {
  createBoard();
  createNumbersPanel();
}


function createBoard() {
  var right = 8;
  let boardDiv = document.getElementsByClassName("board")[0];

  cells.forEach((c, i) => {
    let cellDiv = c.render();

    if (i % 3 == 0)
      cellDiv.style["border-left"] = "3px solid black";
    if (Math.floor(i / 9) % 3 == 0)
      cellDiv.style["border-top"] = "3px solid black";
    if (i <= 80 && i >= 72)
      cellDiv.style["border-bottom"] = "3px solid black";
    if (right == i) {
      right += 9;
      cellDiv.style["border-right"] = "3px solid black";
    }

    cellDiv.onclick = clickCell;
    boardDiv.append(cellDiv);
  });

  boardDiv.childNodes.forEach((c, i) => {
    if (gameBoard.getVal(i) == EMPTY) {
      c.firstChild.innerHTML = " ";
    }
  });
}


function createNumbers() {
  numbers = [];
  let numbersCounts = [];

  for (let i = 0; i < 9; i++)
    numbersCounts.push(0);

  for (let i = 0; i < 81; i++)
    if (gameBoard.getVal(i) != EMPTY)
      numbersCounts[gameBoard.getVal(i) - 1]++;

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
    if (gameBoard.getVal(i) != EMPTY)
      res[i].isFixed = true;
  }

  return res;
}


function createNumbersPanel() {
  let numbersDiv = document.getElementsByClassName("numbers")[0];
  let delDiv = document.createElement("div");
  let editDiv = document.createElement("div");

  numbers.forEach(n => {
    let numDiv = n.render();
    numDiv.onclick = clickNumber;
    numbersDiv.append(numDiv);
  });

  delDiv.innerHTML = "delete";
  delDiv.setAttribute("class", "number");
  delDiv.onclick = deleteCell;
  delDiv.setAttribute("id", "cmdX");
  numbersDiv.append(delDiv);

  editDiv.innerHTML = "draft";
  editDiv.setAttribute("class", "number");
  editDiv.setAttribute("id", "cmdDraft");
  editDiv.onclick = clickDraft;
  numbersDiv.append(editDiv);
}


function clickCell(e) {
  let boardDiv = document.getElementsByClassName("board")[0];
  choosenCell = e.target;

  if (choosenCell != null) {
    for (let i = 0; i < 28; i++) {
      if (neighborsCell[i] == null)
        break;
      neighborsCell[i].classList.remove("clicked-cell-neighbors");
      neighborsCell[i].classList.remove("clicked-same-val");
    }
  }

  let index = getCellIndex();
  squresNeighbors(index);
  rowsNeighbors(index);
  columnsNeighbors(index);

  if (choosenCell.textContent != " ")
    sameVal(choosenCell.textContent, index);
}


function sameVal(cellVAL, index) {
  let boardDiv = document.getElementsByClassName("board")[0];
  let ind = 20;

  for (let i = 0; i < 81; i++) {
    if (cellVAL == boardDiv.childNodes[i].textContent && index != i) {
      neighborsCell.splice(ind, 1, boardDiv.childNodes[i]);
      neighborsCell[ind].classList.add("clicked-same-val");
      ind++;
    }
  }
}


function columnsNeighbors(index) {
  let boardDiv = document.getElementsByClassName("board")[0];
  let columnsDown;

  if ((index / 9) < 1) {
    columnsDown = index + 27;
    for (let i = 14; i < 20; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsDown]);
      columnsDown += 9;
    }
  }

  if ((index / 9) >= 1 && (index / 9) < 2) {
    let columnsDown = index + 18;
    for (let i = 14; i < 20; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsDown]);
      columnsDown += 9;
    }
  }

  if ((index / 9) >= 2 && (index / 9) < 3) {
    let columnsDown = index + 9;
    for (let i = 14; i < 20; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsDown]);
      columnsDown += 9;
    }
  }

  if ((index / 9) >= 3 && (index / 9) < 4) {
    let columnsUp = index - 9;
    let columnsDown = index + 27;
    for (let i = 14; i <= 17; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsUp]);
      columnsUp -= 9;
    }
    for (let i = 17; i < 20; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsDown]);
      columnsDown += 9;
    }
  }

  if ((index / 9) >= 4 && (index / 9) < 5) {
    let columnsUp = index - 18;
    let columnsDown = index + 18;
    for (let i = 14; i < 17; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsUp]);
      columnsUp -= 9;
    }
    for (let i = 17; i < 20; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsDown]);
      columnsDown += 9;
    }
  }

  if ((index / 9) >= 5 && (index / 9) < 6) {
    let columnsUp = index - 27;
    let columnsDown = index + 9;
    for (let i = 14; i < 17; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsUp]);
      columnsUp -= 9;
    }
    for (let i = 17; i < 20; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsDown]);
      columnsDown += 9;
    }
  }

  if ((index / 9) >= 6 && (index / 9) < 7) {
    let columnsUp = index - 9;
    for (let i = 14; i < 20; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsUp]);
      columnsUp -= 9;
    }
  }

  if ((index / 9) >= 7 && (index / 9) < 8) {
    let columnsUp = index - 18;
    for (let i = 14; i < 20; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsUp]);
      columnsUp -= 9;
    }
  }

  if ((index / 9) >= 8 && (index / 9) < 9) {
    let columnsUp = index - 27;
    for (let i = 14; i < 20; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[columnsUp]);
      columnsUp -= 9;
    }
  }

  for (let i = 14; i < 20; i++) {
    neighborsCell[i].classList.add("clicked-cell-neighbors");
  }
}


function rowsNeighbors(index) {
  let boardDiv = document.getElementsByClassName("board")[0];
  let row;
  let rowRight;
  let rowLeft;

  if (((index / 9) % 1).toFixed(1) == 0.0) {
    row = index + 3;
    for (let i = 8; i < 14; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[row]);
      row++;
    }
  }

  if (((index / 9) % 1).toFixed(1) == 0.1) {
    row = index + 2;
    for (let i = 8; i < 14; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[row]);
      row++;
    }
  }

  if (((index / 9) % 1).toFixed(1) == 0.2) {
    row = index + 1;
    for (let i = 8; i < 14; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[row]);
      row++;
    }
  }

  if (((index / 9) % 1).toFixed(1) == 0.3) {
    rowRight = index + 3;
    rowLeft = index - 1;
    for (let i = 8; i < 11; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[rowRight]);
      rowRight++;
    }
    for (let i = 11; i < 14; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[rowLeft]);
      rowLeft--;
    }
  }

  if (((index / 9) % 1).toFixed(1) == 0.4) {
    rowRight = index + 2;
    rowLeft = index - 2;
    for (let i = 8; i < 11; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[rowRight]);
      rowRight++;
    }
    for (let i = 11; i < 14; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[rowLeft]);
      rowLeft--;
    }
  }

  if (((index / 9) % 1).toFixed(1) == 0.6) {
    rowRight = index + 1;
    rowLeft = index - 3;
    for (let i = 8; i < 11; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[rowRight]);
      rowRight++;
    }
    for (let i = 11; i < 14; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[rowLeft]);
      rowLeft--;
    }
  }

  if (((index / 9) % 1).toFixed(1) == 0.7) {
    row = index - 1;
    for (let i = 8; i < 14; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[row]);
      row--;
    }
  }

  if (((index / 9) % 1).toFixed(1) == 0.8) {
    row = index - 2;
    for (let i = 8; i < 14; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[row]);
      row--;
    }
  }

  if (((index / 9) % 1).toFixed(1) == 0.9) {
    row = index - 3;
    for (let i = 8; i < 14; i++) {
      neighborsCell.splice(i, 1, boardDiv.childNodes[row]);
      row--;
    }
  }

  for (let i = 8; i < 14; i++) {
    neighborsCell[i].classList.add("clicked-cell-neighbors");
  }
}

function squresNeighbors(index) {
  let boardDiv = document.getElementsByClassName("board")[0];

  if (index % 3 == 0 && Math.floor((index / 9) % 3) == 0) {
    neighborsCell.splice(0, 1, boardDiv.childNodes[index + 1]);
    neighborsCell.splice(1, 1, boardDiv.childNodes[index + 2]);
    neighborsCell.splice(2, 1, boardDiv.childNodes[index + 9]);
    neighborsCell.splice(3, 1, boardDiv.childNodes[index + 10]);
    neighborsCell.splice(4, 1, boardDiv.childNodes[index + 11]);
    neighborsCell.splice(5, 1, boardDiv.childNodes[index + 18]);
    neighborsCell.splice(6, 1, boardDiv.childNodes[index + 19]);
    neighborsCell.splice(7, 1, boardDiv.childNodes[index + 20]);
    for (let i = 0; i < 8; i++) {
      neighborsCell[i].classList.add("clicked-cell-neighbors");
    }
  }

  if (index % 3 == 0 && Math.floor((index / 9) % 3) == 1) {
    neighborsCell.splice(0, 1, boardDiv.childNodes[index - 9]);
    neighborsCell.splice(1, 1, boardDiv.childNodes[index - 8]);
    neighborsCell.splice(2, 1, boardDiv.childNodes[index - 7]);
    neighborsCell.splice(3, 1, boardDiv.childNodes[index + 1]);
    neighborsCell.splice(4, 1, boardDiv.childNodes[index + 2]);
    neighborsCell.splice(5, 1, boardDiv.childNodes[index + 9]);
    neighborsCell.splice(6, 1, boardDiv.childNodes[index + 10]);
    neighborsCell.splice(7, 1, boardDiv.childNodes[index + 11]);
    for (let i = 0; i < 8; i++) {
      neighborsCell[i].classList.add("clicked-cell-neighbors");
    }
  }

  if (index % 3 == 0 && Math.floor((index / 9) % 3) == 2) {
    neighborsCell.splice(0, 1, boardDiv.childNodes[index - 18]);
    neighborsCell.splice(1, 1, boardDiv.childNodes[index - 17]);
    neighborsCell.splice(2, 1, boardDiv.childNodes[index - 16]);
    neighborsCell.splice(3, 1, boardDiv.childNodes[index - 9]);
    neighborsCell.splice(4, 1, boardDiv.childNodes[index - 8]);
    neighborsCell.splice(5, 1, boardDiv.childNodes[index - 7]);
    neighborsCell.splice(6, 1, boardDiv.childNodes[index + 1]);
    neighborsCell.splice(7, 1, boardDiv.childNodes[index + 2]);
    for (let i = 0; i < 8; i++) {
      neighborsCell[i].classList.add("clicked-cell-neighbors");
    }
  }

  if (index % 3 == 1 && Math.floor((index / 9) % 3) == 0) {
    neighborsCell.splice(0, 1, boardDiv.childNodes[index - 1]);
    neighborsCell.splice(1, 1, boardDiv.childNodes[index + 1]);
    neighborsCell.splice(2, 1, boardDiv.childNodes[index + 8]);
    neighborsCell.splice(3, 1, boardDiv.childNodes[index + 9]);
    neighborsCell.splice(4, 1, boardDiv.childNodes[index + 10]);
    neighborsCell.splice(5, 1, boardDiv.childNodes[index + 17]);
    neighborsCell.splice(6, 1, boardDiv.childNodes[index + 18]);
    neighborsCell.splice(7, 1, boardDiv.childNodes[index + 19]);
    for (let i = 0; i < 8; i++) {
      neighborsCell[i].classList.add("clicked-cell-neighbors");
    }
  }

  if (index % 3 == 1 && Math.floor((index / 9) % 3) == 1) {
    neighborsCell.splice(0, 1, boardDiv.childNodes[index - 10]);
    neighborsCell.splice(1, 1, boardDiv.childNodes[index - 9]);
    neighborsCell.splice(2, 1, boardDiv.childNodes[index - 8]);
    neighborsCell.splice(3, 1, boardDiv.childNodes[index - 1]);
    neighborsCell.splice(4, 1, boardDiv.childNodes[index + 1]);
    neighborsCell.splice(5, 1, boardDiv.childNodes[index + 8]);
    neighborsCell.splice(6, 1, boardDiv.childNodes[index + 9]);
    neighborsCell.splice(7, 1, boardDiv.childNodes[index + 10]);
    for (let i = 0; i < 8; i++) {
      neighborsCell[i].classList.add("clicked-cell-neighbors");
    }
  }

  if (index % 3 == 1 && Math.floor((index / 9) % 3) == 2) {
    neighborsCell.splice(0, 1, boardDiv.childNodes[index - 19]);
    neighborsCell.splice(1, 1, boardDiv.childNodes[index - 18]);
    neighborsCell.splice(2, 1, boardDiv.childNodes[index - 17]);
    neighborsCell.splice(3, 1, boardDiv.childNodes[index - 10]);
    neighborsCell.splice(4, 1, boardDiv.childNodes[index - 9]);
    neighborsCell.splice(5, 1, boardDiv.childNodes[index - 8]);
    neighborsCell.splice(6, 1, boardDiv.childNodes[index - 1]);
    neighborsCell.splice(7, 1, boardDiv.childNodes[index + 1]);
    for (let i = 0; i < 8; i++) {
      neighborsCell[i].classList.add("clicked-cell-neighbors");
    }
  }

  if (index % 3 == 2 && Math.floor((index / 9) % 3) == 0) {
    neighborsCell.splice(0, 1, boardDiv.childNodes[index - 2]);
    neighborsCell.splice(1, 1, boardDiv.childNodes[index - 1]);
    neighborsCell.splice(2, 1, boardDiv.childNodes[index + 7]);
    neighborsCell.splice(3, 1, boardDiv.childNodes[index + 8]);
    neighborsCell.splice(4, 1, boardDiv.childNodes[index + 9]);
    neighborsCell.splice(5, 1, boardDiv.childNodes[index + 16]);
    neighborsCell.splice(6, 1, boardDiv.childNodes[index + 17]);
    neighborsCell.splice(7, 1, boardDiv.childNodes[index + 18]);
    for (let i = 0; i < 8; i++) {
      neighborsCell[i].classList.add("clicked-cell-neighbors");
    }
  }

  if (index % 3 == 2 && Math.floor((index / 9) % 3) == 1) {
    neighborsCell.splice(0, 1, boardDiv.childNodes[index - 11]);
    neighborsCell.splice(1, 1, boardDiv.childNodes[index - 10]);
    neighborsCell.splice(2, 1, boardDiv.childNodes[index - 9]);
    neighborsCell.splice(3, 1, boardDiv.childNodes[index - 1]);
    neighborsCell.splice(4, 1, boardDiv.childNodes[index - 2]);
    neighborsCell.splice(5, 1, boardDiv.childNodes[index + 7]);
    neighborsCell.splice(6, 1, boardDiv.childNodes[index + 8]);
    neighborsCell.splice(7, 1, boardDiv.childNodes[index + 9]);
    for (let i = 0; i < 8; i++) {
      neighborsCell[i].classList.add("clicked-cell-neighbors");
    }
  }

  if (index % 3 == 2 && Math.floor((index / 9) % 3) == 2) {
    neighborsCell.splice(0, 1, boardDiv.childNodes[index - 20]);
    neighborsCell.splice(1, 1, boardDiv.childNodes[index - 19]);
    neighborsCell.splice(2, 1, boardDiv.childNodes[index - 18]);
    neighborsCell.splice(3, 1, boardDiv.childNodes[index - 11]);
    neighborsCell.splice(4, 1, boardDiv.childNodes[index - 10]);
    neighborsCell.splice(5, 1, boardDiv.childNodes[index - 9]);
    neighborsCell.splice(6, 1, boardDiv.childNodes[index - 2]);
    neighborsCell.splice(7, 1, boardDiv.childNodes[index - 1]);
    for (let i = 0; i < 8; i++) {
      neighborsCell[i].classList.add("clicked-cell-neighbors");
    }
  }
}

function clickNumber(e) {
  let index;
  let indx;

  if (choosenCell == null)
    return;

  choosenCell.classList.remove("clicked-cell");
  if (isDraft) {
    toggleDraftCell();
    toggleDraftMode();
    assignDraft(e.target.firstChild.innerHTML);
  } else {
    toggleDraftCell();
    choosenCell.firstChild.innerHTML = e.target.firstChild.innerHTML;
    index = getCellIndex();
    gameBoard.setVal(index, parseInt(choosenCell.firstChild.innerHTML));

    index = parseInt(e.target.firstChild.innerHTML);
    numbers[index - 1].increaseAmount();
    e.target.lastChild.innerHTML = numbers[index - 1].amount;

    indx = getCellIndex();
    choosenCell.classList.remove("illegal-cell");
    if ((gameBoard.isLegalcell(indx)) == false)
      choosenCell.classList.add("illegal-cell");

    if (gameBoard.done())
      endGame();
  }

  choosenCell = null;
}


function getCellIndex() {
  let boardDiv = document.getElementsByClassName("board")[0];
  for (let i = 0; i < boardDiv.childNodes.length; i++)
    if (boardDiv.childNodes[i] == choosenCell)
      return i;
}


function deleteCell(e) {
  let num;
  let index;

  if (choosenCell == null)
    return;

  choosenCell.classList.remove("clicked-cell");
  choosenCell.classList.remove("illegal-cell");

  if (isDraftCell()) {
    clearDrafts();
  } else {
    num = parseInt(choosenCell.innerHTML);
    choosenCell.innerHTML = "";
    index = getCellIndex();
    gameBoard.setVal(index, EMPTY);

    document.getElementsByClassName("numbers")[0].childNodes.forEach(
      n => {
        if (n.firstChild.innerHTML == num) {
          numbers[num - 1].decreaseAmount();
          n.lastChild.innerHTML = numbers[num - 1].amount;
        }
      }
    );
  }
}


function clickDraft() {
  let draftDiv = document.getElementById("cmdDraft");

  if (isDraft)
    draftDiv.classList.remove("draft-clicked");
  else
    draftDiv.classList.add("draft-clicked");
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


function toggleDraftMode() {
  let draftDiv = document.getElementById("cmdDraft");

  if (isDraft)
    draftDiv.classList.remove("draft-clicked");
  else
    draftDiv.classList.add("draft-clicked");

  isDraft = !isDraft;
}


function assignDraft(num) {
  let numbersTable = choosenCell.lastChild.getElementsByTagName("td");
  let numInt = parseInt(num);
  let i = 0;

  for (let count = 1; i < numbersTable.length; i++, count++)
    if (count == numInt)
      break;
  if (numbersTable[i].innerHTML == "")
    numbersTable[i].innerHTML = num;
  else
    numbersTable[i].innerHTML = "";
}


function isDraftCell() {
  return choosenCell.lastChild.style.display == "block";
}


function clearDrafts() {
  let numbersTable = choosenCell.lastChild.getElementsByTagName("td");

  for (let i = 0; i < numbersTable.length; i++)
    numbersTable[i].innerHTML = "";
}


function endGame() {
  let endMsg = document.createElement("div");

  endMsg.innerHTML = "<h1>Success!</h1>";
  endMsg.classList.add("endmsg");
  document.body.append(endMsg);
  document.getElementsByClassName("board")[0].style["pointer-events"] = "none";
  document.getElementsByClassName("numbers")[0].style["pointer-events"] = "none";
}
