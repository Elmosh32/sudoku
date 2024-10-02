class BoardManager {
  constructor(level) {
    this.level = level;

    this.numbers = [];
    this.cells = [];

    this.neighborsCells = [];
    this.sameValCells = [];

    this.squares = [];
    this.rows = [];
    this.cols = [];

    this.numbersInSquares = [];
    this.numbersInRows = [];
    this.numbersInCols = [];

    this.gameBoard = [];

    this.createEmptyBoard();
    this.createBoard(0, 0);
    this.generateGameBoard();
    this.boardDiv = document.getElementsByClassName("board")[0];
  }

  createNumbers() {
    let numbersCounts = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      numbersCounts.push(0);
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.getValByIndex(i) != EMPTY) {
        numbersCounts[this.getValByIndex(i) - 1]++;
      }
    }

    for (let i = 1; i <= GRID_SIZE; i++) {
      this.numbers.push(new NumberPanel(i));
      this.numbers[i - 1].amount = numbersCounts[i - 1];
    }

    return this.numbers;
  }

  createCells() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.cells.push(new Cell(this.getValByIndex(i)));
      if (this.getValByIndex(i) != EMPTY) {
        this.cells[i].isFixed = true;
      }
    }
    return this.cells;
  }

  generateGameBoard() {
    const selectedCells = new Set();
    const totalEmptyCells = EMPTY_CELLS[this.level];
    let cellsSelected = 0;

    while (cellsSelected < totalEmptyCells) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      const cellKey = `${row}-${col}`;

      if (!selectedCells.has(cellKey)) {
        selectedCells.add(cellKey);
        this.gameBoard[row][col][1] = EMPTY;
        cellsSelected++;
      }
    }
  }

  createEmptyBoard() {
    for (let i = 0; i < GRID_SIZE; i++) {
      let row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        let pair = [EMPTY, EMPTY];
        row.push(pair);
      }
      this.gameBoard.push(row);
    }
  }

  createBoard(row, col) {
    let numbers = [];

    if (col == GRID_SIZE) {
      row++;
      col = 0;
    }

    if (row == GRID_SIZE) {
      return this.isLegal(this.gameBoard);
    }

    for (let i = 1; i <= GRID_SIZE; i++) {
      numbers.push(i);
    }

    this.shuffle(numbers);

    for (let i = 0; i < numbers.length; i++) {
      let pair = [numbers[i], numbers[i]];
      this.gameBoard[row][col] = pair;

      if (this.isLegal(this.gameBoard)) {
        if (this.createBoard(row, col + 1)) {
          return true;
        }
      }
    }

    this.gameBoard[row][col] = EMPTY;
    return false;
  }

  shuffle(arr) {
    arr.forEach((element, i) => {
      let index = Math.floor(Math.random() * GRID_SIZE);
      let temp = arr[i];
      arr[i] = arr[index];
      arr[index] = temp;
    });
  }

  isLegal(boardArr) {
    return (
      this.checkRows(boardArr) &&
      this.checkCols(boardArr) &&
      this.checkSquares(boardArr)
    );
  }

  isLegalcell(cell) {
    if (!cell) {
      return false;
    }

    let index = this.getCellIndex(cell);

    let row = Math.floor(index / GRID_SIZE);
    let col = index % GRID_SIZE;

    if (this.gameBoard[row][col][0] != this.gameBoard[row][col][1]) {
      return false;
    } else {
      return true;
    }
  }

  checkRows(boardArr) {
    let rows = boardArr.map((row) => row.map((pair) => pair[1]));

    for (let i = 0; i < GRID_SIZE; i++) {
      if (!this.isValidArr(rows[i])) {
        return false;
      }
    }

    return true;
  }

  checkCols(boardArr) {
    for (let i = 0; i < GRID_SIZE; i++) {
      let col = boardArr.map((row) => row[i][0]);
      if (!this.isValidArr(col)) {
        return false;
      }
    }

    return true;
  }

  checkSquares(boardArr) {
    for (let i = 0; i < GRID_SIZE; i += BOX_SIZE) {
      for (let j = 0; j < GRID_SIZE; j += BOX_SIZE) {
        let arr = [];
        for (let k = i; k < i + BOX_SIZE; k++) {
          for (let w = j; w < j + BOX_SIZE; w++) {
            arr.push(boardArr[k][w][0]);
          }
        }
        if (!this.isValidArr(arr)) {
          return false;
        }
      }
    }

    return true;
  }

  isValidArr(arr) {
    let a = [];

    for (let i = 0; i <= GRID_SIZE; i++) {
      a.push(0);
    }

    arr.forEach((element) => a[element]++);
    a[0] = 0;

    return a.every((element) => element == 1 || element == EMPTY);
  }

  getValByIndex(index) {
    let row = Math.floor(index / GRID_SIZE);
    let col = index % GRID_SIZE;

    return this.gameBoard[row][col][1];
  }

  getValByCell(cell) {
    let index = this.getCellIndex(cell);

    let row = Math.floor(index / GRID_SIZE);
    let col = index % GRID_SIZE;

    return this.gameBoard[row][col][1];
  }

  getCorrectVal(cell) {
    let index = this.getCellIndex(cell);
    let row = Math.floor(index / GRID_SIZE);
    let col = index % GRID_SIZE;

    return this.gameBoard[row][col][0];
  }

  setVal(value, cell) {
    let index = this.getCellIndex(cell);

    let row = Math.floor(index / GRID_SIZE);
    let col = index % GRID_SIZE;

    this.gameBoard[row][col][1] = value;
  }

  getRow(index) {
    return Math.floor(index / GRID_SIZE);
  }

  getColumn(index) {
    return index % GRID_SIZE;
  }

  getSquareIndex(index) {
    const row = this.getRow(index);
    const col = this.getColumn(index);

    let squareRow = Math.floor(row / BOX_SIZE);
    let squareCol = Math.floor(col / BOX_SIZE);

    return squareRow * BOX_SIZE + squareCol;
  }

  getCellIndex(chosenCell) {
    for (let i = 0; i < this.boardDiv.childNodes.length; i++) {
      if (this.boardDiv.childNodes[i] == chosenCell) {
        return i;
      }
    }
  }

  isEmptyCell(cell) {
    if (cell && !this.getValByCell(cell)) {
      return true;
    } else {
      return false;
    }
  }

  getCurrentCell() {
    return this.boardDiv.childNodes[this.getCellIndex()];
  }

  initSquareFullCells() {
    this.numbersInSquares = [];

    for (let square = 0; square < GRID_SIZE; square++) {
      let squareFullCells = [];
      let squareCells = [];
      let squareStartRow = Math.floor(square / BOX_SIZE) * BOX_SIZE;
      let squareStartCol = (square % BOX_SIZE) * BOX_SIZE;

      for (let row = squareStartRow; row < squareStartRow + BOX_SIZE; row++) {
        for (let col = squareStartCol; col < squareStartCol + BOX_SIZE; col++) {
          if (this.gameBoard[row][col][1]) {
            squareFullCells.push(
              this.boardDiv.childNodes[row * GRID_SIZE + col]
            );
          }
          squareCells.push(this.boardDiv.childNodes[row * GRID_SIZE + col]);
        }
      }

      this.numbersInSquares[square] = squareFullCells;
      this.squares[square] = squareCells;
    }
  }

  initRowFullCells() {
    for (let row = 0; row < GRID_SIZE; row++) {
      let currRowNums = [];
      let currRowCells = [];
      for (let currCell = 0; currCell < GRID_SIZE; currCell++) {
        if (this.gameBoard[row][currCell][1]) {
          currRowNums.push(
            this.boardDiv.childNodes[row * GRID_SIZE + currCell]
          );
        }
        currRowCells.push(this.boardDiv.childNodes[row * GRID_SIZE + currCell]);
      }
      this.rows[row] = currRowCells;
      this.numbersInRows[row] = currRowNums;
    }
  }

  initColsFullCells() {
    for (let col = 0; col < GRID_SIZE; col++) {
      let currColsNums = [];
      let currColCells = [];
      for (let currCell = 0; currCell < GRID_SIZE; currCell++) {
        if (this.gameBoard[currCell][col][1]) {
          currColsNums.push(
            this.boardDiv.childNodes[currCell * GRID_SIZE + col]
          );
        }
        currColCells.push(this.boardDiv.childNodes[currCell * GRID_SIZE + col]);
      }
      this.cols[col] = currColCells;
      this.numbersInCols[col] = currColsNums;
    }
  }

  initAnimatedCells() {
    this.initSquareFullCells();
    this.initRowFullCells();
    this.initColsFullCells();
  }

  removeFromSquareCells(currCell, index) {
    let square = this.getSquareIndex(index);

    this.numbersInSquares[square] = this.numbersInSquares[square].filter(
      (cell) => cell !== currCell
    );
  }

  removeFromRowCells(currCell, index) {
    let row = this.getRow(index);

    this.numbersInRows[row] = this.numbersInRows[row].filter(
      (cell) => cell !== currCell
    );
  }

  removeFromColCells(currCell, index) {
    let col = this.getColumn(index);

    this.numbersInCols[col] = this.numbersInCols[col].filter(
      (cell) => cell !== currCell
    );
  }

  removeFromAnimatedCells(cell) {
    let index = this.getCellIndex(cell);

    this.removeFromSquareCells(cell, index);
    this.removeFromRowCells(cell, index);
    this.removeFromColCells(cell, index);
  }

  updateSquareCells(currCell, index) {
    let square = this.getSquareIndex(index);
    this.numbersInSquares[square].push(currCell);
    return this.numbersInSquares[square];
  }

  updateRowCells(currCell, index) {
    let row = this.getRow(index);
    this.numbersInRows[row].push(currCell);
    return this.numbersInRows[row];
  }

  updateColCells(currCell, index) {
    let col = this.getColumn(index);
    this.numbersInCols[col].push(currCell);
    return this.numbersInCols[col];
  }

  getAnimatedCells(cell) {
    let index = this.getCellIndex(cell);
    let square = this.updateSquareCells(cell, index);
    let row = this.updateRowCells(cell, index);
    let col = this.updateColCells(cell, index);

    let animatedCells = [];
    animatedCells = animatedCells.concat(
      ...(square.length == GRID_SIZE ? [square] : []),
      ...(row.length == GRID_SIZE ? [row] : []),
      ...(col.length == GRID_SIZE ? [col] : [])
    );

    return animatedCells;
  }

  getSqaureNums(index) {
    let square = this.getSquareIndex(index);
    return this.numbersInSquares[square].map((cell) => cell.textContent);
  }

  getRowNums(index) {
    let row = this.getRow(index);
    return this.numbersInRows[row].map((cell) => cell.textContent);
  }

  getColNums(index) {
    let col = this.getColumn(index);
    return this.numbersInCols[col].map((cell) => cell.textContent);
  }

  getAutofillNumbers(index) {
    let square = this.getSqaureNums(index);
    let row = this.getRowNums(index);
    let col = this.getColNums(index);

    let availableNumbers = [];
    for (let i = 1; i <= GRID_SIZE; i++) {
      if (
        !square.includes(String(i)) &&
        !row.includes(String(i)) &&
        !col.includes(String(i))
      ) {
        availableNumbers.push(i);
      }
    }

    return availableNumbers;
  }

  decreaseAmountVal(num) {
    document.getElementsByClassName("numbers")[0].childNodes.forEach((n) => {
      if (n.firstChild.innerHTML == num) {
        this.numbers[num - 1].decreaseAmount();
        n.lastChild.innerHTML = this.numbers[num - 1].amount;
      }
    });
  }

  increaseAmountVal(num) {
    let numbersDiv = document.getElementsByClassName("numbers")[0];

    this.numbers[num - 1].increaseAmount();
    numbersDiv.childNodes[num - 1].lastChild.innerHTML =
      this.numbers[num - 1].amount;
  }

  updateSameValCells(cellVAL, chosenCell) {
    this.sameValCells[cellVAL - 1].push(chosenCell);
  }

  initSameValCells() {
    for (let i = 0; i < GRID_SIZE; i++) {
      this.sameValCells.push([]);
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      let cellNode = this.boardDiv.childNodes[i];
      let cellNumberDiv = cellNode.querySelector(".cell-number.cell-fixed");
      if (cellNumberDiv) {
        this.sameValCells[this.boardDiv.childNodes[i].textContent - 1].push(
          this.boardDiv.childNodes[i]
        );
      }
    }
  }

  initNeighborsCells() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.neighborsCells.push([]);
      let square = this.squares[this.getSquareIndex(i)];
      let row = this.rows[this.getRow(i)];
      let col = this.cols[this.getColumn(i)];
      this.neighborsCells[i] = this.neighborsCells[i].concat(square, row, col);
    }
  }

  deleteFromSameValCells(cellVAL, chosenCell) {
    this.sameValCells[cellVAL - 1] = this.sameValCells[cellVAL - 1].filter(
      (cell) => cell !== chosenCell
    );
  }

  getSameValCells(cellVAL) {
    return this.sameValCells[cellVAL - 1];
  }

  getNeighborsCells(cell) {
    let index = this.getCellIndex(cell);
    return this.neighborsCells[index];
  }
}
