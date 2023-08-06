const EMPTY = 0;
const EASY = 0,
  MEDIUM = 1,
  HARD = 2,
  EVIL = 3;
const EMPTY_CELLS = [1, 50, 55, 60];
const BOARD_SIZE = 81;
const GRID_SIZE = 9;
const BOX_SIZE = 3;

class Sudoku {
  constructor(level) {
    this.N = GRID_SIZE;
    this.level = level;
    this.gameBoard = this.createEmptyBoard();
    this.createBoard(0, 0);
    this.generateGameBoard();
  }

  generateGameBoard() {
    for (let i = 1; i <= EMPTY_CELLS[this.level]; i++) {
      let row = Math.floor(Math.random() * this.N);
      let col = Math.floor(Math.random() * this.N);
      while (this.gameBoard[row][col] == EMPTY) {
        row = Math.floor(Math.random() * this.N);
        col = Math.floor(Math.random() * this.N);
      }

      this.gameBoard[row][col][1] = EMPTY;
    }
  }

  createEmptyBoard() {
    let res = [];

    for (let i = 0; i < this.N; i++) {
      let row = [];
      for (let j = 0; j < this.N; j++) {
        let pair = [EMPTY, EMPTY];
        row.push(pair);
      }
      res.push(row);
    }

    return res;
  }

  createBoard(row, col) {
    let numbers = [];

    if (col == this.N) {
      row++;
      col = 0;
    }

    if (row == this.N) {
      return this.isLegal(this.gameBoard);
    }

    for (let i = 1; i <= this.N; i++) {
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
      let ind = Math.floor(Math.random() * this.N);
      let temp = arr[i];
      arr[i] = arr[ind];
      arr[ind] = temp;
    });
  }

  isLegal(boardArr) {
    return (
      this.checkRows(boardArr) &&
      this.checkCols(boardArr) &&
      this.checkSquares(boardArr)
    );
  }

  isLegalcell(ind) {
    let row = Math.floor(ind / this.N);
    let col = ind % this.N;
    if (this.gameBoard[row][col][0] != this.gameBoard[row][col][1]) {
      return false;
    } else {
      return true;
    }
  }

  checkRows(boardArr) {
    let rows = boardArr.map((row) => row.map((pair) => pair[1]));

    for (let i = 0; i < this.N; i++) {
      if (!this.isValidArr(rows[i])) {
        return false;
      }
    }
    return true;

    // return boardArr.every(boardArr.map((row) => this.isValidArr(row[1])));
  }

  checkCols(boardArr) {
    for (let i = 0; i < this.N; i++) {
      let col = boardArr.map((row) => row[i][0]);
      if (!this.isValidArr(col)) {
        return false;
      }
    }
    return true;
  }

  checkSquares(boardArr) {
    for (let i = 0; i < this.N; i += BOX_SIZE) {
      for (let j = 0; j < this.N; j += BOX_SIZE) {
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

    for (let i = 0; i <= this.N; i++) {
      a.push(0);
    }

    arr.forEach((element) => a[element]++);
    a[0] = 0;
    return a.every((element) => element == 1 || element == EMPTY);
  }

  getVal(ind) {
    let row = Math.floor(ind / this.N);
    let col = ind % this.N;

    return this.gameBoard[row][col][1];
  }

  getCorrectVal(ind) {
    let row = Math.floor(ind / this.N);
    let col = ind % this.N;

    return this.gameBoard[row][col][0];
  }

  setVal(ind, value) {
    let row = Math.floor(ind / this.N);
    let col = ind % this.N;

    this.gameBoard[row][col][1] = value;
  }
}
