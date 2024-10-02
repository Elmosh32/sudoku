const EMPTY = 0;
const EASY = 0,
  MEDIUM = 1,
  HARD = 2,
  EVIL = 3;
const EMPTY_CELLS = [42, 48, 52, 56];
const BOARD_SIZE = 81;
const GRID_SIZE = 9;
const BOX_SIZE = 3;

class GameManager {
  constructor() {
    this.numbers = [];
    this.cells = [];
    this.level = null;

    this.validCells = BOARD_SIZE;
    this.boardManager = null;
    this.gameLogic = null;
    this.uiManager = null;
    this.timerManager = null;
    this.soundManager = null;
    this.themeManager = null;

    this.clickStart = this.clickStart.bind(this);
  }

  initializeGame() {
    const startScreen = document.querySelector(".start-screen");
    startScreen.style.display = "none";

    this.boardManager = new BoardManager(this.level);
    this.timerManager = new TimerManager();
    this.soundManager = new SoundManager();
    this.themeManager = new ThemeManager();

    this.numbers = this.boardManager.createNumbers();
    this.cells = this.boardManager.createCells();

    this.validCells -= EMPTY_CELLS[this.level];

    this.uiManager = new UIManager(this.boardManager, this.cells, this.numbers);

    this.gameLogic = new GameLogic(
      this.boardManager,
      this.timerManager,
      this.soundManager,
      this.uiManager,
      this.numbers,
      this.validCells
    );

    document.getElementById("stopwatchContainer").style.display = "inline";
    this.timerManager.startStopwatch();
    this.gameLogic.setupEventListeners();
  }

  clickStart() {
    const rdo = document.querySelector('input[name="options"]:checked');
    const difficulty = document.querySelector(
      "label[for=" + rdo.id + "]"
    ).innerHTML;

    switch (difficulty) {
      case "Easy":
        this.level = EASY;
        break;
      case "Medium":
        this.level = MEDIUM;
        break;
      case "Hard":
        this.level = HARD;
        break;
      case "Evil":
        this.level = EVIL;
        break;
    }

    this.initializeGame();
  }
}
const gameManager = new GameManager();

/*-----------------------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------EventListener to navbar---------------------------------------------------
  -----------------------------------------------------------------------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  soundManager = new SoundManager();
  themeManager = new ThemeManager();
  timerManager = new TimerManager();

  function closeNavbar() {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector("#navbar-collapse");
    navbarCollapse.classList.remove("show");
    navbarToggler.setAttribute("aria-expanded", "false");
  }

  const speakerIcon = document.getElementById("speakerIcon");
  if (speakerIcon) {
    speakerIcon.addEventListener("click", () => {
      soundManager.toggleSound();
      setTimeout(closeNavbar, 400);
    });
  }

  const themeModeIcon = document.getElementById("ThemeMode");
  if (themeModeIcon) {
    themeModeIcon.addEventListener("click", () => {
      themeManager.toggleTheme();
      setTimeout(closeNavbar, 400);
    });
  }
});
