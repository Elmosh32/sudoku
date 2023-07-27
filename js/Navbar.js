var navbarItems = `<div class="container-fluid">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <a class="navbar-brand navbar brand sudoku-txt" href="Sudoku.html">
          Sudoku
          <i class="fa-solid fa-chess-board" style="color: #2fde7c"></i>
          Online
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
          <ul class="navbar-nav ms-auto text-start">
            <li class="nav-item">
              <a class="nav-link" href="Sudoku.html"> New Game&nbsp </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="Info.html">
                Info&nbsp
                <i
                  class="fa-solid fa-circle-info"
                  style="color: dodgerblue; margin-right:10px;"
                ></i>
              </a>
            </li>
            <li class="nav-item">
              <p class="nav-link" style="all: unset; color: white">
                DarkMode
              </p>
              <label class="switch nav-link">
                <input type="checkbox" onclick="toggleThemeMode()" />
                <span class="slider round"></span>
              </label>
            </li>
          </ul>
        </div>
      </nav>
    </div>`;

document.body.insertAdjacentHTML("afterbegin", navbarItems);
