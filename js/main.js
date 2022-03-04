(() => {
  const options = {
    width: 10,
    height: 10,
    reset: () => {
      drawTable();
    },
  };

  let currentPosition = 1;

  const gameTable = document.getElementById("game");

  let possibleTargets = [];

  const won = () => {
    tsParticles.load("tsparticles", {
      fullScreen: {
        enable: true,
        zIndex: 100,
      },
      particles: {
        number: {
          value: 0,
        },
        color: {
          value: ["#00FFFC", "#FC00FF", "#fffc00"],
        },
        shape: {
          type: ["circle", "square"],
        },
        opacity: {
          value: 1,
          animation: {
            enable: true,
            minimumValue: 0,
            speed: 2,
            startValue: "max",
            destroy: "min",
          },
        },
        size: {
          value: 4,
          random: {
            enable: true,
            minimumValue: 2,
          },
        },
        links: {
          enable: false,
        },
        life: {
          duration: {
            sync: true,
            value: 5,
          },
          count: 1,
        },
        move: {
          enable: true,
          gravity: {
            enable: true,
            acceleration: 10,
          },
          speed: { min: 10, max: 20 },
          decay: 0.1,
          direction: "none",
          straight: false,
          outModes: {
            default: "destroy",
            top: "none",
          },
        },
        rotate: {
          value: {
            min: 0,
            max: 360,
          },
          direction: "random",
          move: true,
          animation: {
            enable: true,
            speed: 60,
          },
        },
        tilt: {
          direction: "random",
          enable: true,
          move: true,
          value: {
            min: 0,
            max: 360,
          },
          animation: {
            enable: true,
            speed: 60,
          },
        },
        roll: {
          darken: {
            enable: true,
            value: 25,
          },
          enable: true,
          speed: {
            min: 15,
            max: 25,
          },
        },
        wobble: {
          distance: 30,
          enable: true,
          move: true,
          speed: {
            min: -15,
            max: 15,
          },
        },
      },
      interactivity: {
        detectsOn: "window",
        events: {
          resize: true,
        },
      },
      detectRetina: true,
      emitters: {
        direction: "none",
        life: {
          count: 0,
          duration: 0.1,
          delay: 0.4,
        },
        rate: {
          delay: 0.1,
          quantity: 150,
        },
        size: {
          width: 0,
          height: 0,
        },
      },
    });

    var wonModal = new bootstrap.Modal(document.getElementById("wonModal"), {
      keyboard: false,
      focus: true,
      backdrop: "static",
    });

    wonModal.show();
  };

  const lost = (score) => {
    if (confirm(`You reached: ${score}! Want to retry?`)) {
      drawTable();
    }
  };

  const initBgParticles = () => {
    // tsParticles: https://github.com/matteobruni/tsparticles
    tsParticles.load("tsparticles", {
      fullScreen: {
        enable: true,
        zIndex: -2,
      },
      particles: {
        color: {
          value: ["#222", "#333", "#072e07", "#300"],
        },
        number: {
          value: 200,
        },
        move: {
          enable: true,
          speed: 2,
        },
        opacity: {
          value: 1,
        },
        shape: {
          type: ["square", "circle", "triangle"],
        },
        size: {
          value: {
            min: 50,
            max: 100,
          },
          animation: {
            enable: true,
            speed: 5,
            sync: false,
          },
        },
      },
    });
  };

  const drawTable = () => {
    possibleTargets = [];
    currentPosition = 1;
    gameTable.innerHTML = "";
    initBgParticles();

    for (let i = 0; i < options.width; i++) {
      const tr = document.createElement("span");

      tr.classList.add("row");

      for (let j = 0; j < options.height; j++) {
        const td = document.createElement("div");

        td.classList.add("cell");

        td.text = "";
        td.dataset.row = i;
        td.dataset.column = j;
        td.addEventListener("click", (e) => handleClick(e.target));

        tr.append(td);
      }

      gameTable.append(tr);
    }
  };

  const handleClick = (target) => {
    if (currentPosition === 1 || possibleTargets.includes(target)) {
      target.innerText = currentPosition++;

      possibleTargets = [];

      const row = parseInt(target.dataset.row);
      const column = parseInt(target.dataset.column);
      const indexes = [];

      indexes.push({
        row: row,
        column: column + 3,
      });
      indexes.push({
        row: row,
        column: column - 3,
      });

      indexes.push({
        row: row + 3,
        column: column,
      });
      indexes.push({
        row: row - 3,
        column: column,
      });

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

      for (const tr of gameTable.childNodes) {
        for (const td of tr.childNodes) {
          td.classList.add("disabled");
          td.classList.remove("active");
        }
      }

      target.classList.add("active");

      for (const index of indexes) {
        const tr = gameTable.childNodes[index.row];

        if (!tr) {
          continue;
        }

        const td = tr.childNodes[index.column];

        if (!td) {
          continue;
        }

        if (!td.innerText) {
          td.classList.remove("disabled");
          possibleTargets.push(td);
        }
      }

      setTimeout(() => {
        if (!possibleTargets.length) {
          if (currentPosition > options.width * options.height) {
            won();
          } else {
            lost(currentPosition - 1);
          }
        } else if (possibleTargets.length === 1) {
          setTimeout(() => {
            handleClick(possibleTargets[0]);
          }, 50);
        }
      }, 50);
    }
  };

  // Object-GUI: https://github.com/matteobruni/object-gui

  drawTable();

  document.getElementById("reset").addEventListener("click", () => {
    options.reset();
  });

  let visibleEditor = false;

  document.getElementById("toggleEditor").addEventListener("click", () => {
    console.log(visibleEditor);

    if (visibleEditor) {
      visibleEditor = false;

      var oldEditor = document.getElementById("m_grid_editor");

      if (oldEditor) {
        oldEditor.remove();
      }
    } else {
      visibleEditor = true;

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
