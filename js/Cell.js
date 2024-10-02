class Cell {
  constructor(val) {
    this.val = val;
    this.isDraft = false;
    this.isFixed = false;
  }

  render() {
    let cellDiv = document.createElement("div");
    let cellNum = document.createElement("div");
    let cellTable;
    let tblStr;

    cellDiv.setAttribute("class", "cell");

    cellNum.setAttribute("class", "cell-number");
    if (this.isFixed == true) {
      cellNum.classList.add("cell-fixed");
    }

    cellNum.innerHTML = this.val;

    cellTable = document.createElement("table");
    tblStr = this.createTable();
    cellTable.setAttribute("class", "cell-table");
    cellTable.innerHTML = tblStr;

    cellDiv.append(cellNum);
    cellDiv.append(cellTable);
    return cellDiv;
  }

  createTable() {
    let str = "";

    for (let i = 1; i <= BOX_SIZE; i++) {
      str += "<tr>";
      for (let j = 1; j <= BOX_SIZE; j++) {
        str += "<td></td>";
      }
      str += "</tr>";
    }

    return `<table class="cell-table">${str}</table>`;
  }
}
