class ThemeManager {
  constructor() {
    this.isDarkMode = localStorage.getItem("isDarkMode") === "true";
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = localStorage.getItem("isDarkMode") !== "true";
    localStorage.setItem("isDarkMode", this.isDarkMode.toString());
    this.applyTheme();
  }

  applyTheme() {
    document.documentElement.setAttribute(
      "data-force-color-mode",
      this.isDarkMode ? "dark" : "light"
    );
    document.querySelector(".switch input").checked = this.isDarkMode;
    if (window.location.href.includes("sudoku.html")) {
      this.changeButtonsClass();
    }
  }

  changeButtonsClass() {
    const buttons = [
      { id: "btnEasy", color: "success" },
      { id: "btnMedium", color: "info" },
      { id: "btnHard", color: "warning" },
      { id: "btnEvil", color: "danger" },
    ];

    buttons.forEach((button) => {
      const btnElement = document.getElementById(button.id);
      if (this.isDarkMode) {
        btnElement.classList.add(`btn-outline-${button.color}`);
        btnElement.classList.remove(`btn-${button.color}`);
      } else {
        btnElement.classList.remove(`btn-outline-${button.color}`);
        btnElement.classList.add(`btn-${button.color}`);
      }
    });
  }
}
