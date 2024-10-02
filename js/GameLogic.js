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
      numDiv.onclick = (e) => this.clickNumber(e);
    });
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));

    delDiv.onclick = (e) => this.deleteCell(e);

    draftDiv.onclick = (e) => this.clickDraft(e);

    autofillDiv.onclick = (e) => this.autofill(e);

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

    this.chosenCell = e.target;

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

  clickNumber(e) {
    if (this.timerManager.getTimerStatus() || this.chosenCell == null) {
      return;
    }

    let currVal, prevVal;

    if (this.isDraft) {
      if (this.boardManager.isEmptyCell(this.chosenCell)) {
        this.uiManager.toggleDraftCell(this.chosenCell, this.isDraft);
        if (this.keyboardNumber) {
          currVal = this.keyboardNumber;
          this.uiManager.assignDraft(parseInt(currVal), this.chosenCell);
          this.keyboardNumber = null;
        } else {
          this.uiManager.assignDraft(
            e.target.firstChild.innerHTML,
            this.chosenCell
          );
        }
      }
    } else {
      this.uiManager.toggleDraftCell(this.chosenCell, this.isDraft);
      if (!this.uiManager.isDraftCell(this.chosenCell)) {
        this.uiManager.clearDrafts(this.chosenCell);
      }
      prevVal = this.boardManager.getValByCell(this.chosenCell);

      if (this.keyboardNumber) {
        this.chosenCell.firstChild.innerHTML = this.keyboardNumber;
        currVal = this.keyboardNumber;
        this.boardManager.setVal(parseInt(currVal), this.chosenCell);
        this.keyboardNumber = null;
      } else {
        this.chosenCell.firstChild.innerHTML = e.target.firstChild.innerHTML;
        this.boardManager.setVal(
          parseInt(this.chosenCell.firstChild.innerHTML),
          this.chosenCell
        );
        currVal = parseInt(e.target.firstChild.innerHTML);
      }
      this.uiManager.removeIllegalCellStyle(this.chosenCell);
      if (!this.boardManager.isLegalcell(this.chosenCell)) {
        this.uiManager.removeSameValMark(currVal);

        if (prevVal == this.boardManager.getCorrectVal(this.chosenCell)) {
          this.boardManager.decreaseAmountVal(prevVal);
          this.validCells--;
          this.boardManager.removeFromAnimatedCells(this.chosenCell);
        }

        this.uiManager.addIllegalCellStyle(this.chosenCell);
        soundManager.playSound("incorrect");
      } else {
        if (prevVal != this.numbers[currVal - 1].val) {
          this.boardManager.increaseAmountVal(currVal);
          this.validCells++;

          let animatedCells = this.boardManager.getAnimatedCells(
            this.chosenCell
          );
          if (animatedCells.length > EMPTY) {
            this.uiManager.runCellsAnimation(animatedCells);
            soundManager.playSound("areaCompleted");
          }
          this.chosenCell.classList.display = "";
          this.uiManager.markSameVal(
            this.numbers[currVal - 1].val,
            this.chosenCell
          );
          this.boardManager.updateSameValCells(
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
      this.clickNumber(this.chosenCell);
    }

    if (key === "Backspace") {
      this.deleteCell(e);
    }
  }

  deleteCell(e) {
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

      if (!this.boardManager.isLegalcell(this.chosenCell)) {
        return;
      }

      this.validCells--;
      this.boardManager.deleteFromSameValCells(num, this.chosenCell);
      this.uiManager.removeSameValMark(num);
      this.boardManager.decreaseAmountVal(num);
    }
  }

  clickDraft(e) {
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

  autofill(e) {
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
}
