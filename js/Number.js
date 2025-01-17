class NumberPanel {
  constructor(val) {
    this.val = val;
    this.amount = 0;
  }

  increaseAmount() {
    this.amount++;
  }

  decreaseAmount() {
    this.amount--;
  }

  render() {
    let numDiv = document.createElement("div");
    numDiv.setAttribute("class", "number-panel");

    let numVal = document.createElement("div");
    numVal.setAttribute("class", "number-panel-val");
    numVal.innerHTML = this.val;

    let numAmount = document.createElement("div");
    numAmount.setAttribute("class", "number-panel-amount");
    numAmount.innerHTML = this.amount;

    numDiv.append(numVal);
    numDiv.append(numAmount);

    return numDiv;
  }
}
