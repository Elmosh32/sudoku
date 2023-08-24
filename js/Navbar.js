var navbarItems = `<div class="container-fluid">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <a class="navbar-brand navbar brand sudoku-txt" href="sudoku.html">
      Sudoku
      <i class="fa-solid fa-chess-board" style="color: #2fde7c"></i>
      Online
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbar-collapse"
      aria-controls="navbar-collapse"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbar-collapse">
      <ul class="navbar-nav ms-auto text-start">
        <li class="nav-item spacing">
          <a class="nav-link" href="sudoku.html"> New Game&nbsp </a>
        </li>
        <li class="nav-item spacing">
          <a class="nav-link" href="info.html">
            Info&nbsp
            <i
              class="fa-solid fa-circle-info"
              style="color: dodgerblue; margin-right: 10px"
            ></i>
          </a>
        </li>
        <li class="nav-item spacing">
          <a href="#" class="nav-link" data-toggle="collapse">
            Sound
            <div class="speaker" id="speakerIcon" >
              <span></span>
            </div>
          </a>
        </li>
        <li class="nav-item spacing">
          <a href="#" class="nav-link" data-toggle="collapse">
            Dark Mode
            <label class="switch">
              <input id="ThemeMode" type="checkbox" onclick="toggleThemeMode()" title="Toggle theme mode" placeholder="Theme mode">
              <span class="slider round"></span>
            </label>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</div>
`;

document.body.insertAdjacentHTML("afterbegin", navbarItems);
