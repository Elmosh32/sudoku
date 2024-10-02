class UIManager {
  constructor(boardManager, cells, numbers) {
    this.boardManager = boardManager;
    this.cells = cells;
    this.numbers = numbers;

    this.currentSameValCells = null;
    this.currentNeighborsCells = null;

    this.boardDiv = document.querySelector(".board");
    this.createGUI();
    this.boardManager.initAnimatedCells();
    this.boardManager.initSameValCells();
    this.boardManager.initNeighborsCells();
  }

  createGUI() {
    this.drawBoard();
    this.createNumbersPanel();
  }

  drawBoard() {
    this.cells.forEach((cell, i) => {
      const cellDiv = cell.render();

      if (i % BOX_SIZE === 0) cellDiv.style["border-left"] = "3px solid black";
      if (Math.floor(i / GRID_SIZE) % BOX_SIZE === 0)
        cellDiv.style["border-top"] = "3px solid black";
      if (i <= 80 && i >= 72)
        cellDiv.style["border-bottom"] = "3px solid black";
      if (i % GRID_SIZE === 8)
        cellDiv.style["border-right"] = "3px solid black";

      this.boardDiv.append(cellDiv);
    });

    this.boardDiv.childNodes.forEach((cell, i) => {
      if (this.boardManager.getValByIndex(i) === EMPTY) {
        cell.firstChild.innerHTML = " ";
      }
    });
  }

  createNumbersPanel() {
    let numbersDiv = document.getElementsByClassName("numbers")[0];
    let delDiv = document.createElement("div");
    let draftDiv = document.createElement("div");
    let autofillDiv = document.createElement("div");

    this.numbers.forEach((n) => {
      let numDiv = n.render();
      numbersDiv.append(numDiv);
    });

    delDiv.innerHTML = "delete";
    if (this.isMobileOrTablet()) {
      delDiv.setAttribute("class", "number-panel-mobile cmd");
    } else {
      delDiv.setAttribute("class", "number-panel cmd");
    }
    delDiv.setAttribute("id", "cmdX");
    numbersDiv.append(delDiv);

    draftDiv.innerHTML = "draft";
    if (this.isMobileOrTablet()) {
      draftDiv.setAttribute("class", "number-panel-mobile cmd");
    } else {
      draftDiv.setAttribute("class", "number-panel cmd");
    }
    draftDiv.setAttribute("id", "cmdDraft");
    numbersDiv.append(draftDiv);

    autofillDiv.innerHTML = "Autofill";
    if (this.isMobileOrTablet()) {
      autofillDiv.setAttribute("class", "number-panel-mobile cmd");
    } else {
      autofillDiv.setAttribute("class", "number-panel cmd");
    }
    autofillDiv.setAttribute("id", "cmdAutofill");
    numbersDiv.append(autofillDiv);
  }

  toggleDraftCell(chosenCell, isDraft) {
    if (isDraft) {
      chosenCell.firstChild.style.diplay = "none";
      chosenCell.lastChild.style.display = "block";
    } else {
      chosenCell.firstChild.style.diplay = "block";
      chosenCell.lastChild.style.display = "none";
    }
  }

  assignAutoFillDraft(index, numbers) {
    this.boardDiv.childNodes[index].lastChild.style.display = "block";
    let numbersTable =
      this.boardDiv.childNodes[index].lastChild.getElementsByTagName("td");

    numbers.forEach((num) => {
      numbersTable[num - 1].classList.add("draft-num");
      numbersTable[num - 1].innerHTML = num;
    });
  }

  assignDraft(num, chosenCell) {
    let numbersTable = chosenCell.lastChild.getElementsByTagName("td");

    if (numbersTable[num - 1].innerHTML == "") {
      numbersTable[num - 1].classList.add("draft-num");
      numbersTable[num - 1].innerHTML = num;
    } else {
      numbersTable[num - 1].innerHTML = "";
    }
  }

  isDraftCell(chosenCell) {
    return chosenCell.lastChild.style.display == "block";
  }

  clearDrafts(chosenCell) {
    let numbersTable = chosenCell.lastChild.getElementsByTagName("td");

    for (let i = 0; i < numbersTable.length; i++) {
      numbersTable[i].innerHTML = "";
    }
  }

  isMobileOrTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  }

  markNeighborsCells(chosenCell) {
    if (chosenCell === "undefined" || chosenCell === null) {
      return;
    }
    this.currentNeighborsCells =
      this.boardManager.getNeighborsCells(chosenCell);

    this.currentNeighborsCells.forEach((cell) => {
      cell.classList.add("clicked-cell-neighbors");
    });

    chosenCell.classList.remove("clicked-cell-neighbors");
  }

  markSameVal(cellVAL, chosenCell) {
    this.currentSameValCells = this.boardManager.getSameValCells(cellVAL);

    this.currentSameValCells.forEach((cell) =>
      cell.classList.add("clicked-same-val")
    );
    chosenCell.classList.remove("clicked-same-val");
  }

  clearMarks(chosenCell) {
    if (
      !this.currentSameValCells ||
      chosenCell === "undefined" ||
      chosenCell === null
    ) {
      return;
    }
    this.removeSameValMark();
    this.removeNeighborsMark();
  }

  removeSameValMark() {
    if (!this.currentSameValCells) {
      return;
    }

    this.currentSameValCells.forEach((cell) => {
      cell.classList.remove("clicked-same-val");
    });
  }

  removeNeighborsMark() {
    if (!this.currentNeighborsCells) {
      return;
    }

    this.currentNeighborsCells.forEach((cell) => {
      cell.classList.remove("clicked-cell-neighbors");
    });
  }

  endGameAnimation() {
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

    this.showConfetti();
  }

  runCellsAnimation(animatedCells) {
    this.animateCells(animatedCells);
    setTimeout(() => this.clearAnimationClasses(animatedCells), 1300);
  }

  animateCells(animatedCells) {
    for (const cell of animatedCells) {
      cell.classList.add("active-cells-animation");
    }
  }

  clearAnimationClasses(animatedCells) {
    animatedCells.forEach((cell) => {
      cell.classList.remove("active-cells-animation");
    });
    animatedCells = [];
  }

  showConfetti() {
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

  resumeWatchStyle() {
    const draftElements = document.querySelectorAll(".draft-num");
    draftElements.forEach((draft) => {
      draft.classList.remove("clear-draft");
    });

    const cellElements = document.querySelectorAll(".cell");
    cellElements.forEach((cell) => {
      cell.classList.remove("paused-cell");
    });

    const boardGrid = document.querySelectorAll(".board");
    boardGrid.forEach((board) => {
      board.classList.remove("paused-board");
    });
  }

  pauseWatchStyle() {
    const draftElements = document.querySelectorAll(".draft-num");
    draftElements.forEach((draft) => {
      draft.classList.add("clear-draft");
    });

    const cellElements = document.querySelectorAll(".cell");
    cellElements.forEach((cell) => {
      cell.classList.add("paused-cell");
    });

    const boardGrid = document.querySelectorAll(".board");
    boardGrid.forEach((board) => {
      board.classList.add("paused-board");
    });
  }

  addDraftDisabledStyle() {
    let draftDiv = document.getElementById("cmdDraft");

    draftDiv.classList.add("draft-disabled");
  }

  removeDraftDisabledStyle() {
    let draftDiv = document.getElementById("cmdDraft");

    draftDiv.classList.remove("draft-disabled");
  }

  addIllegalCellStyle(chosenCell) {
    chosenCell.classList.add("illegal-cell");
  }

  removeIllegalCellStyle(chosenCell) {
    chosenCell.classList.remove("illegal-cell");
  }

  addDraftClickedStyle() {
    let draftDiv = document.getElementById("cmdDraft");

    draftDiv.classList.remove("cmd");

    if (this.isMobileOrTablet()) {
      draftDiv.classList.add("draft-clicked-mobile");
    } else {
      draftDiv.classList.add("draft-clicked");
    }
  }

  removeDraftClickedStyle() {
    let draftDiv = document.getElementById("cmdDraft");

    if (this.isMobileOrTablet()) {
      draftDiv.classList.remove("draft-clicked-mobile");
    } else {
      draftDiv.classList.remove("draft-clicked");
    }

    draftDiv.classList.add("cmd");
  }
}
