class GameLogic {
  constructor(
    boardManager,
    timerManager,
    soundManager,
    uiManager,
    numbers,
    validCells
  ) {
    this.boardManager = boardManager;
    this.timerManager = timerManager;
    this.soundManager = soundManager;
    this.uiManager = uiManager;
    this.numbers = numbers;
    this.validCells = validCells;

    this.isDraft = false;
    this.chosenCell = null;
    this.keyboardNumber = null;
  }

  setupEventListeners() {
    const cellDiv = document.querySelectorAll(".cell");
    const numbersDivs = document.querySelectorAll(".number-panel");
    const delDiv = document.getElementById("cmdX");
    const draftDiv = document.getElementById("cmdDraft");
    const autofillDiv = document.getElementById("cmdAutofill");
    const resumeBtn = document.getElementById("resumeBtn");
    const pauseBtn = document.getElementById("pauseBtn");

    cellDiv.forEach((cell) => {
      cell.onclick = (e) => this.clickCell(e);
    });

    numbersDivs.forEach((numDiv) => {
      numDiv.onclick = (e) => this.handleNumberInput(e);
    });
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));

    delDiv.onclick = (e) => this.clearCell(e);

    draftDiv.onclick = (e) => this.handleDraftMode(e);

    autofillDiv.onclick = (e) => this.autoFillCells(e);

    resumeBtn.addEventListener("click", () => {
      this.handleResumeClick();
    });

    pauseBtn.addEventListener("click", () => {
      this.handlePauseClick();
    });
  }

  /**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
   *********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
   **********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
  clickCell(e) {
    if (this.timerManager.getTimerStatus()) {
      return;
    }

    if (e.target) {
      this.chosenCell = e.target;
    }

    this.uiManager.removeNeighborsMark();
    this.uiManager.removeSameValMark(this.chosenCell.textContent);
    this.uiManager.markNeighborsCells(this.chosenCell);

    if (this.isDraft) {
      if (this.boardManager.isEmptyCell(this.chosenCell)) {
        this.uiManager.removeDraftDisabledStyle();
      } else {
        if (this.boardManager.isLegalcell(this.chosenCell)) {
          this.uiManager.markSameVal(
            this.chosenCell.textContent,
            this.chosenCell
          );
        }
        this.uiManager.addDraftDisabledStyle();
      }
    } else {
      if (
        !this.uiManager.isDraftCell(this.chosenCell) &&
        this.chosenCell.textContent.trim() &&
        this.boardManager.isLegalcell(this.chosenCell)
      ) {
        this.uiManager.markSameVal(
          this.chosenCell.textContent,
          this.chosenCell
        );
      }
    }
  }

  handleNumberInput(e) {
    if (this.timerManager.getTimerStatus() || this.chosenCell == null) {
      return;
    }

    if (this.isDraft) {
      if (this.boardManager.isEmptyCell(this.chosenCell)) {
        this.uiManager.toggleDraftCell(this.chosenCell, this.isDraft);
        const boundSetVal = this.uiManager.assignDraft.bind(this.uiManager);
        this.numInputType(e, boundSetVal);
      }
    } else {
      this.uiManager.toggleDraftCell(this.chosenCell, this.isDraft);
      if (!this.uiManager.isDraftCell(this.chosenCell)) {
        this.uiManager.clearDrafts(this.chosenCell);
      }

      let prevVal = this.boardManager.getValByCell(this.chosenCell);
      const boundSetVal = this.boardManager.setVal.bind(this.boardManager);
      let currVal = this.numInputType(e, boundSetVal);
      this.chosenCell.firstChild.innerHTML = currVal;

      this.uiManager.removeIllegalCellStyle(this.chosenCell);
      if (!this.boardManager.isLegalcell(this.chosenCell)) {
        this.uiManager.removeSameValMark(currVal);

        if (prevVal == this.boardManager.getCorrectVal(this.chosenCell)) {
          this.boardManager.decreaseAmountVal(prevVal);
          this.validCells--;
          this.boardManager.removeFromAnimatedCells(this.chosenCell);
        }

        this.uiManager.addIllegalCellStyle(this.chosenCell);
        if (prevVal != EMPTY) {
          this.boardManager.decreaseSameVal(prevVal, this.chosenCell);
        }

        this.boardManager.deleteFromSameValCells(currVal, this.chosenCell);
        soundManager.playSound("incorrect");
      } else {
        if (prevVal != this.numbers[currVal - 1].val) {
          this.boardManager.increaseAmountVal(currVal);
          this.validCells++;

          this.boardManager.increaseSameVal(
            this.numbers[currVal - 1].val,
            this.chosenCell
          );
          let animatedCells = this.boardManager.getAnimatedCells(
            this.chosenCell
          );
          let currentSameValCells = this.boardManager.getSameValCells(currVal);

          if (
            animatedCells.length > EMPTY ||
            currentSameValCells.length == GRID_SIZE
          ) {
            this.uiManager.runCellsAnimation(animatedCells, currVal);
            soundManager.playSound("areaCompleted");
          }
          this.chosenCell.classList.display = "";
          this.uiManager.markSameVal(
            this.numbers[currVal - 1].val,
            this.chosenCell
          );

          soundManager.playSound("correct");
        }
      }

      if (this.validCells == BOARD_SIZE) {
        soundManager.playSound("winSound");
        clearInterval(this.timerManager.stopwatchInterval);
        this.uiManager.endGameAnimation();
      }
    }
  }

  handleKeyDown(e) {
    const key = e.key;

    if (key >= "1" && key <= "9") {
      this.keyboardNumber = parseInt(key, 10);
      this.handleNumberInput(this.chosenCell);
    }

    if (key === "Backspace") {
      this.clearCell(e);
    }

    if (key === "ArrowUp") {
      e.preventDefault();
      if (this.chosenCell) {
        this.chosenCell = this.boardManager.getUpCell(this.chosenCell);
        this.clickCell(this.chosenCell);
      }
    }

    if (key === "ArrowDown") {
      e.preventDefault();
      if (this.chosenCell) {
        this.chosenCell = this.boardManager.getDownCell(this.chosenCell);
        this.clickCell(this.chosenCell);
      }
    }

    if (key === "ArrowRight") {
      if (this.chosenCell) {
        this.chosenCell = this.boardManager.getRightCell(this.chosenCell);
        this.clickCell(this.chosenCell);
      }
    }

    if (key === "ArrowLeft") {
      if (this.chosenCell) {
        this.chosenCell = this.boardManager.getLeftCell(this.chosenCell);
        this.clickCell(this.chosenCell);
      }
    }
  }

  clearCell(e) {
    if (this.timerManager.getTimerStatus() || this.chosenCell == null) {
      return;
    }

    let num;

    this.uiManager.removeDraftDisabledStyle();
    this.uiManager.removeIllegalCellStyle(this.chosenCell);

    soundManager.playSound("deleteSound");

    if (this.uiManager.isDraftCell(this.chosenCell)) {
      this.uiManager.clearDrafts(this.chosenCell);
    } else {
      this.boardManager.removeFromAnimatedCells(this.chosenCell);
      num = parseInt(this.chosenCell.firstChild.textContent);
      this.chosenCell.firstChild.textContent = "";
      this.boardManager.setVal(EMPTY, this.chosenCell);

      if (!this.boardManager.isLegalcell(this.chosenCell, num)) {
        return;
      }

      this.boardManager.decreaseSameVal(num, this.chosenCell);
      this.validCells--;
      this.boardManager.deleteFromSameValCells(num, this.chosenCell);
      this.uiManager.removeSameValMark(num);
      this.boardManager.decreaseAmountVal(num);
    }
  }

  handleDraftMode(e) {
    if (this.timerManager.getTimerStatus()) {
      return;
    }

    if (this.isDraft) {
      this.uiManager.removeDraftClickedStyle();
      if (this.chosenCell) {
        if (this.boardManager.isEmptyCell(this.chosenCell)) {
          this.uiManager.removeDraftDisabledStyle();
        }
      }
    } else {
      this.uiManager.addDraftClickedStyle();

      if (this.chosenCell) {
        if (!this.boardManager.isEmptyCell(this.chosenCell)) {
          this.uiManager.addDraftDisabledStyle();
        } else {
          this.uiManager.removeDraftDisabledStyle();
        }
      }
    }

    this.isDraft = !this.isDraft;
  }

  autoFillCells(e) {
    if (this.timerManager.getTimerStatus()) {
      return;
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.boardManager.getValByIndex(i) == EMPTY) {
        let numbers = this.boardManager.getAutofillNumbers(i);
        this.uiManager.assignAutoFillDraft(i, numbers);
      }
    }
  }

  handleResumeClick() {
    this.timerManager.resumeStopwatch();
    this.uiManager.resumeWatchStyle();
    this.uiManager.markNeighborsCells(this.chosenCell);
    if (!this.boardManager.isEmptyCell(this.chosenCell)) {
      if (this.boardManager.isLegalcell(this.chosenCell)) {
        this.uiManager.markSameVal(
          this.chosenCell.textContent,
          this.chosenCell
        );
      }
    }
  }

  handlePauseClick() {
    this.timerManager.pauseStopwatch();
    this.uiManager.pauseWatchStyle();
    this.uiManager.clearMarks(this.chosenCell);
  }

  numInputType(e, setValFunc) {
    let currVal;
    if (this.keyboardNumber) {
      currVal = this.keyboardNumber;
      setValFunc(parseInt(currVal), this.chosenCell);
      // this.boardManager.setVal(parseInt(currVal), this.chosenCell);

      this.keyboardNumber = null;
    } else {
      currVal = parseInt(e.target.firstChild.innerHTML);
      setValFunc(parseInt(currVal), this.chosenCell);

      // this.boardManager.setVal(currVal, this.chosenCell);
    }

    return currVal;
  }
}
