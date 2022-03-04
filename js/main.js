(() => {
  // game options
  const options = {
    width: 10,
    height: 10,
    reset: () => {
      drawTable();
    },
  };

  // tracking selected cell
  let currentPosition = 1;

  // the dom container
  const gameTable = document.getElementById("game");

  // possible moves, from the selected cell
  let possibleTargets = [];

  let confettiContainer;

  // won function
  const won = () => {
    // tsParticles: https://github.com/matteobruni/tsparticles
    tsParticles
      .loadJSON("confetti", "particles/confetti.json")
      .then((container) => (confettiContainer = container));

    // bootstrap modal for winners
    var wonModal = new bootstrap.Modal(document.getElementById("wonModal"), {
      keyboard: false,
      focus: true,
      backdrop: "static",
    });

    wonModal.show();
  };

  // lost function, score will be displayed
  const lost = (score) => {
    if (confirm(`You reached: ${score}! Want to retry?`)) {
      drawTable();
    }
  };

  // animated background initializer
  const initBgParticles = () => {
    // tsParticles: https://github.com/matteobruni/tsparticles
    tsParticles.loadJSON("tsparticles", "particles/bg.json");
  };

  // draw game table function, resets the game
  const drawTable = () => {
    // resetting the target
    possibleTargets = [];

    // resetting the current cell
    currentPosition = 1;

    // clearing previous game
    gameTable.innerHTML = "";

    // drawing rows
    for (let i = 0; i < options.width; i++) {
      // creating the row element
      const tr = document.createElement("span");

      tr.classList.add("row");

      // drawing cells
      for (let j = 0; j < options.height; j++) {
        // creating the cell element
        const td = document.createElement("div");

        td.classList.add("cell");

        // initializing the cell
        td.text = "";
        td.dataset.row = i;
        td.dataset.column = j;
        td.addEventListener("click", (e) => handleClick(e.target));

        tr.append(td);
      }

      gameTable.append(tr);
    }
  };

  // cell click handler
  const handleClick = (target) => {
    // check if the click is valid
    if (currentPosition !== 1 && !possibleTargets.includes(target)) {
      return;
    }

    // writing the current position in the selected cell
    target.innerText = currentPosition++;

    // resetting targets
    possibleTargets = [];

    // disabling all cells, the right ones will be reactivated
    for (const tr of gameTable.childNodes) {
      for (const td of tr.childNodes) {
        td.classList.add("disabled");
        td.classList.remove("active");
      }
    }

    // setting the selected cell to active
    target.classList.add("active");

    // reading row and column of the selected cell
    const row = parseInt(target.dataset.row), column = parseInt(target.dataset.column);

    // iterating through possible indexes
    const indexes = [];

    // horizontal indexes
    indexes.push({
      row: row,
      column: column + 3,
    });

    indexes.push({
      row: row,
      column: column - 3,
    });

    // vertical indexes
    indexes.push({
      row: row + 3,
      column: column,
    });

    indexes.push({
      row: row - 3,
      column: column,
    });

    // diagonal indexes
    indexes.push({
      row: row + 2,
      column: column + 2,
    });

    indexes.push({
      row: row + 2,
      column: column - 2,
    });

    indexes.push({
      row: row - 2,
      column: column + 2,
    });

    indexes.push({
      row: row - 2,
      column: column - 2,
    });

    // checking the possible indexes
    for (const index of indexes) {
      const tr = gameTable.childNodes[index.row];

      // if the row is not existing, skipping
      if (!tr) {
        continue;
      }

      const td = tr.childNodes[index.column];

      // if the cell is not existing, skipping
      if (!td) {
        continue;
      }

      // if the column has no text inside, is valid
      if (!td.innerText) {
        td.classList.remove("disabled");

        possibleTargets.push(td);
      }
    }

    // setting a small timeout, the UI thread needs to be freed
    // using this, the user is going to understand what's happening
    setTimeout(() => {
      // checking if there are valid targets
      if (!possibleTargets.length) {
        // no more targets remaining, it's either a won or a loss
        if (currentPosition > options.width * options.height) {
          // it's a won, if the current position (1 indexed), is overflowing
          won();
        } else {
          // if the current position is still a valid value, it's a loss
          lost(currentPosition - 1);
        }
      } else if (possibleTargets.length === 1) {
        // if there's only a possible target
        // the move will be automatically done, using recursion
        setTimeout(() => {
          handleClick(possibleTargets[0]);
        }, 50);
      }
    }, 50);
  };

  // initializing the game
  drawTable();

  // initializing the animated background
  initBgParticles();

  // handling click event of the reset button
  document.getElementById("reset").addEventListener("click", () => {
    options.reset();
  });

  // initializing the game editor, only for rows and columns
  let visibleEditor = false;

  document.getElementById("toggleEditor").addEventListener("click", () => {
    // this is a toggle, if the editor is visible, it will become hidden
    if (visibleEditor) {
      visibleEditor = false;

      var oldEditor = document.getElementById("m_grid_editor");

      if (oldEditor) {
        oldEditor.remove();
      }
    } else {
      visibleEditor = true;

      // Object-GUI: https://github.com/matteobruni/object-gui
      const editor = new Editor("grid", "Grid Editor", options);

      editor.top().right().theme("neu-dark");

      editor.root
        .addProperty("width", "Width", "number")
        .step(1)
        .min(5)
        .max(20)
        .change(() => {
          drawTable();
        });

      editor.root
        .addProperty("height", "Height", "number")
        .step(1)
        .min(5)
        .max(20)
        .change(() => {
          drawTable();
        });

      editor.root.addButton("reset", "Reset");
    }
  });
})();
