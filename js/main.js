/* ··········Elementos principales del DOM·········· */
//pantallas
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const gameBoxNode = document.querySelector("#game-box");
const textGameOverNode = document.querySelector("#textGameOver");
const controlsScreenNode = document.querySelector("#controls-Screen");
const hiScoreListNode = document.querySelector("#hiScoreList");
const hiScorePoint = document.querySelector("#hiScorePoint");
const yourScore = document.querySelector("#your-score");
//botones
const startBtnNode = document.querySelector("#start-btn");
const hiScoreBtnNode = document.querySelector("#hiScore-btn");
const controlsNode = document.querySelector("#controls-btn");
const returnControlsNode = document.querySelector("#returnControl-btn");
const restartGameNode = document.querySelector("#restart-game-btn");
const returnGameNode = document.querySelector("#return-game-btn");

/* ··········Variables globales del juego·········· */
let player = null;
let keyPressed = {};
let firePlayer = null;
let fireArr = [];
let playerH = 40;
let playerW = 50;
let fireH = 35;
let fireW = 40;
let positionPlayerX = 50;
let positionPlayerY = 300;
let enemyPlaneArr = [];
let fireBallArr = [];
let fuelArr = [];
let level = 0;
const showLevel = document.getElementById("level");
let local = JSON.parse(localStorage.getItem("HiScore"));
let hiScore = "0000";
let hiScoreArr = local ? local : [];
let resulthiScore = [];
let timeRemaining = 30;
const typewriter = document.getElementById("typewriter");

/* ··········Funciones globales del juego·········· */
//escritura de pantalla de inicio
const textTypewriter = (text = "", time = 200) => {
  let characterArr = text.split("");
  typewriter.innerHTML = "";
  let cont = 0;
  let wrhite = setInterval(function () {
    typewriter.innerHTML += characterArr[cont];
    cont++;
    if (cont === characterArr.length) {
      clearInterval(wrhite);
    }
  }, time);
};
textTypewriter(
  "Desde tiempos inmemorables, los habitantes de Aetheria estan en guerra, tu mision es acabar con los enemigos y restaurar de nuevo la paz. Suerte!",
  120
);
//movimiento fluido player
function movePlayer() {
  window.addEventListener("keydown", (event) => {
    keyPressed[event.key] = true;
  });
  window.addEventListener("keyup", (event) => {
    keyPressed[event.key] = false;
  });
  if (keyPressed["ArrowUp"]) {
    player.planeMovement("up");
  }
  if (keyPressed["ArrowDown"]) {
    player.planeMovement("down");
  }
  if (keyPressed["ArrowRight"]) {
    player.planeMovement("right");
  }
  if (keyPressed["ArrowLeft"]) {
    player.planeMovement("left");
  }
}
//Función principal
function startGame() {
  //actualizar pantallas
  startScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";
  gameOverScreenNode.style.display = "none";
  returnGameNode.style.display = "none";
  controlsScreenNode.style.display = "none";

  // añadir elementos al juego
  player = new PlayerPlane(positionPlayerX, positionPlayerY, playerH, playerW);

  //añadimos primer nivel
  level1();

  //añadir temporizador
  const minutes = Math.floor(timeRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeRemaining % 60).toString().padStart(2, "0");
  const timeRemainingContainer = document.getElementById("timeRemaining");
  timeRemainingContainer.innerText = `${minutes}:${seconds}`;

  //generamos duración del juego
  let timerId = setInterval(() => {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeRemaining % 60).toString().padStart(2, "0");
    if (timeRemaining <= 5) {
      timeRemainingContainer.className = "finalTime";
    }
    timeRemainingContainer.innerText = `${minutes}:${seconds}`;
    if (timeRemaining === 0) {
      clearInterval(timerId);
      hiScoreArr.push(hiScore);
      gameOver();
    }
  }, 1000);

  //iniciar Intervalo de juego
  gameIntervalId = setInterval(() => {
    gameLoop();
  }, Math.round(1000 / 60));
}
//función bucle
function gameLoop() {
  movePlayer();
  movementFire();
  outFire();
  outEnemyPlane();
  outFireBall();
  detectFire();
  detectCollisionPlayer();
  detectCollisionFireBall();
  detectCollisionFuel();
}
//añadimos disparos
function addFire() {
  firePlayer = new FirePlayer(fireH, fireW, playerW);
  fireArr.push(firePlayer);
}
//damos movimiento al disparo
function movementFire() {
  fireArr.forEach((elem) => {
    elem.fire();
  });
}
// eliminamos salida de disparos en Dom y en js
function outFire() {
  if (fireArr.length === 0) {
    return;
  }
  if (fireArr[0].x >= 900) {
    fireArr[0].node.remove();
    fireArr.splice(0, 1);
  }
}
//creamos y añadimos aviones enemigos
function addEnemyPlane() {
  let randomPositionY = Math.floor(Math.random() * 560);
  let newPlane = new EnemyPlane(randomPositionY);
  enemyPlaneArr.push(newPlane);
}
//eliminamos salida de aviones enemigos en DOM y en js
function outEnemyPlane() {
  if (enemyPlaneArr.length === 0) {
    return;
  }
  if (enemyPlaneArr[0].x < 0 - enemyPlaneArr[0].w) {
    enemyPlaneArr[0].node.remove();
    enemyPlaneArr.splice(0, 1);
  }
}
//creamos y añadimos bolas de fuego
function addFireBall() {
  let randomPositionYFireBall = Math.floor(Math.random() * 600);
  let newFireBall = new FireBall(randomPositionYFireBall);
  fireBallArr.push(newFireBall);
}
//eliminamos salida de bolas de fuego en DOM y en js
function outFireBall() {
  if (fireBallArr.length === 0) {
    return;
  }
  if (fireBallArr[0].x < 0 - fireBallArr[0].w) {
    fireBallArr[0].node.remove();
    fireBallArr.splice(0, 1);
  }
}
//creamos y añadimos fuel
function addFuel() {
  let randomPositionYFuel = Math.floor(Math.random() * 600);
  let newFuel = new Fuel(randomPositionYFuel);
  fuelArr.push(newFuel);
}
//eliminamos salida de fuel en DOM y en js
function outFuel() {
  if (fuelArr.length === 0) {
    return;
  }
  if (fuelArr[0].x < 0 - fuelArr[0].w) {
    fuelArr[0].node.remove();
    fuelArr.splice(0, 1);
  }
}
//detectamos disparos en avones enemigos y los borramos del DOM, añadimos puntuacion al score
function detectFire() {
  enemyPlaneArr.forEach((enemyPlane, indexEnemyPlane) => {
    fireArr.forEach((fire, indexFire) => {
      if (
        fire.x < enemyPlane.x + enemyPlane.w &&
        fire.x + fire.w > enemyPlane.x &&
        fire.y < enemyPlane.y + enemyPlane.h &&
        fire.y + fire.h > enemyPlane.y
      ) {
        enemyPlaneArr[indexEnemyPlane].node.remove();
        enemyPlaneArr.splice(indexEnemyPlane, 1);
        fireArr[indexFire].node.remove();
        fireArr.splice(indexFire, 1);
        addHiScore();
        showmarkerHiScore();
        moveLevel();
      }
    });
  });
}
//detectamos colision avion enemigo
function detectCollisionPlayer() {
  enemyPlaneArr.forEach((enemyPlane, indexEnemyPlane) => {
    if (
      player.x < enemyPlane.x + enemyPlane.w &&
      player.x + player.w > enemyPlane.x &&
      player.y < enemyPlane.y + enemyPlane.h &&
      player.y + player.h > enemyPlane.y
    ) {
      enemyPlaneArr[indexEnemyPlane].node.remove();
      enemyPlaneArr.splice(indexEnemyPlane, 1);
      addHiScoreArr();
      gameOver();
      timeRemaining = 0;
    }
  });
}
//detectamos colision bola de fuego
function detectCollisionFireBall() {
  fireBallArr.forEach((fireBall, indexFireBall) => {
    if (
      player.x < fireBall.x + fireBall.w &&
      player.x + player.w > fireBall.x &&
      player.y < fireBall.y + fireBall.h &&
      player.y + player.h > fireBall.y
    ) {
      fireBallArr[indexFireBall].node.remove();
      fireBallArr.splice(indexFireBall, 1);
      addHiScoreArr();
      gameOver();
      timeRemaining = 0;
    }
  });
}
//detectamos colision fuel
function detectCollisionFuel() {
  fuelArr.forEach((fuel, indexFuel) => {
    if (
      player.x < fuel.x + fuel.w &&
      player.x + player.w > fuel.x &&
      player.y < fuel.y + fuel.h &&
      player.y + player.h > fuel.y
    ) {
      fuelArr[indexFuel].node.remove();
      fuelArr.splice(indexFuel, 1);
      timeRemaining += 15;
    }
  });
}
//movemos de nivel
function moveLevel() {
  switch (hiScore) {
    case 1000:
      level2();
      break;
    case 2000:
      level3();
      break;
    case 3000:
      level4();
      break;
    case 4000:
      level5();
    case 5000:
      level6();
      break;
  }
}
//subimos dificultad por cada level
function level1() {
  fuelIntervalIdLevel1 = setInterval(() => {
    addFuel();
  }, 10000);
  fuelSpeedIntervalIdLevel1 = setInterval(() => {
    fuelArr.forEach((elem) => {
      elem.automaticMovementFuel();
    });
  }, 1000 / 60);
  enemyPlaneIntervalIdLevel1 = setInterval(() => {
    addEnemyPlane();
  }, 1000);
  enemySpeedPlaneIntervalIdLevel1 = setInterval(() => {
    enemyPlaneArr.forEach((elem) => {
      elem.automaticMovement();
    });
  }, 1000 / 60);
  level++;
  showLevel.textContent = level;
}
function level2() {
  clearInterval(enemyPlaneIntervalIdLevel1);
  clearInterval(enemySpeedPlaneIntervalIdLevel1);
  enemyPlaneIntervalIdLevel2 = setInterval(() => {
    addEnemyPlane();
  }, 700);
  enemySpeedPlaneIntervalIdLevel2 = setInterval(() => {
    enemyPlaneArr.forEach((elem) => {
      elem.automaticMovement();
    });
  }, 1000 / 80);
  fireballIntervalIdLevel2 = setInterval(() => {
    addFireBall();
  }, 4000);
  fireBallSpeedIntervalIdLevel2 = setInterval(() => {
    fireBallArr.forEach((elem) => {
      elem.automaticMovementFireBall();
    });
  }, 15);
  level++;
  showLevel.textContent = level;
}
function level3() {
  console.log("entro en nivel3");
  clearInterval(enemySpeedPlaneIntervalIdLevel2);
  clearInterval(enemyPlaneIntervalIdLevel2);
  clearInterval(fireballIntervalIdLevel2);
  clearInterval(fireBallSpeedIntervalIdLevel2);
  enemyPlaneIntervalIdLevel3 = setInterval(() => {
    addEnemyPlane();
  }, 400);
  enemySpeedPlaneIntervalIdLevel3 = setInterval(() => {
    enemyPlaneArr.forEach((elem) => {
      elem.automaticMovement();
    });
  }, 1000 / 100);
  fireballIntervalIdLevel3 = setInterval(() => {
    addFireBall();
  }, 2000);
  fireBallSpeedIntervalIdLevel3 = setInterval(() => {
    fireBallArr.forEach((elem) => {
      elem.automaticMovementFireBall();
    });
  }, 13);
  level++;
  showLevel.textContent = level;
}
function level4() {
  console.log("entro en nivel4");
  clearInterval(enemySpeedPlaneIntervalIdLevel3);
  clearInterval(enemyPlaneIntervalIdLevel3);
  clearInterval(fireballIntervalIdLevel3);
  clearInterval(fireBallSpeedIntervalIdLevel3);
  enemyPlaneIntervalIdLevel4 = setInterval(() => {
    addEnemyPlane();
  }, 300);
  enemySpeedPlaneIntervalIdLevel4 = setInterval(() => {
    enemyPlaneArr.forEach((elem) => {
      elem.automaticMovement();
    });
  }, 1000 / 120);
  fireballIntervalIdLevel4 = setInterval(() => {
    addFireBall();
  }, 800);
  fireBallSpeedIntervalIdLevel4 = setInterval(() => {
    fireBallArr.forEach((elem) => {
      elem.automaticMovementFireBall();
    });
  }, 11);
  level++;
  showLevel.textContent = level;
}
function level5() {
  console.log("entro en nivel5");
  clearInterval(enemySpeedPlaneIntervalIdLevel4);
  clearInterval(enemyPlaneIntervalIdLevel4);
  clearInterval(fireballIntervalIdLevel4);
  clearInterval(fireBallSpeedIntervalIdLevel4);
  enemyPlaneIntervalIdLevel5 = setInterval(() => {
    addEnemyPlane();
  }, 150);
  enemySpeedPlaneIntervalIdLevel5 = setInterval(() => {
    enemyPlaneArr.forEach((elem) => {
      elem.automaticMovement();
    });
  }, 1000 / 120);
  fireballIntervalIdLevel5 = setInterval(() => {
    addFireBall();
  }, 500);
  fireBallSpeedIntervalIdLevel5 = setInterval(() => {
    fireBallArr.forEach((elem) => {
      elem.automaticMovementFireBall();
    });
  }, 9);
  level++;
  showLevel.textContent = level;
}
function level6() {
  clearInterval(enemySpeedPlaneIntervalIdLevel5);
  clearInterval(enemyPlaneIntervalIdLevel5);
  clearInterval(fireballIntervalIdLevel5);
  clearInterval(fireBallSpeedIntervalIdLevel5);
  enemyPlaneIntervalIdLevel6 = setInterval(() => {
    addEnemyPlane();
  }, 50);
  enemySpeedPlaneIntervalIdLevel6 = setInterval(() => {
    enemyPlaneArr.forEach((elem) => {
      elem.automaticMovement();
    });
  }, 1000 / 120);
  fireballIntervalIdLevel6 = setInterval(() => {
    addFireBall();
  }, 100);
  fireBallSpeedIntervalIdLevel6 = setInterval(() => {
    fireBallArr.forEach((elem) => {
      elem.automaticMovementFireBall();
    });
  }, 7);
  level++;
  showLevel.textContent = level;
}
//fin del juego reiniciamos pantallas  y mostramos puntuación
function gameOver() {
  showHiScore();
  clearInterval(gameIntervalId);
  clearInterval(enemyPlaneIntervalIdLevel1);
  gameOverScreenNode.style.display = "flex";
  gameScreenNode.style.display = "none";
  gameBoxNode.style.display = "none";
}
//guardamos la puntuacion en el local storage
function saveLocalStorage() {
  localStorage.setItem("HiScore", JSON.stringify(hiScoreArr));
}
//añadimos HiScore al array
function addHiScoreArr() {
  hiScoreArr.push(hiScore);
}
//incrementamos hiScore
function addHiScore() {
  hiScore = parseInt(hiScore) + 50;
}
//mostramos hiScore en el marcador
function showmarkerHiScore() {
  const hiScoreValue = document.getElementById("hiScoreValue");
  hiScoreValue.textContent = hiScore.toString().padStart(4, "0");
}
// mostramos los resultados en historial pantalla
function showHiScore() {
  let yourScoreNode = document.createElement("p");
  yourScoreNode.innerHTML = `YOUR SCORE: ${hiScore}`;
  yourScore.append(yourScoreNode);
  hiScoreArr.sort((elem1, elem2) => {
    if (elem1 < elem2) {
      return 1;
    } else if (elem1 > elem2) {
      return -1;
    } else {
      return 0;
    }
  });
  hiScoreArr.splice(5, 1);
  console.log(hiScoreArr);
  hiScoreArr.forEach((elem, index) => {
    let hiScoreNode = document.createElement("p");
    hiScoreNode.innerHTML = `${
      index + 1
    }. ----------------------------------- ${elem}`;
    hiScorePoint.append(hiScoreNode);
  });
  saveLocalStorage();
}
//cambiamos vistas para mostrar HiScore
function viewHiScore() {
  showHiScore();
  startScreenNode.style.display = "none";
  textGameOverNode.style.display = "none";
  restartGameNode.style.display = "none";
  gameOverScreenNode.style.display = "flex";
  returnGameNode.style.display = "flex";
}
//cambiamos vistas para mostrar controls
function viewControls() {
  startScreenNode.style.display = "none";
  controlsScreenNode.style.display = "flex";
}
/* ··········Event Listeners·········· */
startBtnNode.addEventListener("click", startGame);
hiScoreBtnNode.addEventListener("click", viewHiScore);
controlsNode.addEventListener("click", viewControls);
returnControlsNode.addEventListener("click", () => {
  location.reload();
});
returnGameNode.addEventListener("click", () => {
  location.reload();
});
restartGameNode.addEventListener("click", () => {
  location.reload();
});
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    addFire();
  }
});
