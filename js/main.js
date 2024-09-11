/* ··········Elementos principales del DOM·········· */
//pantallas
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const gameBoxNode = document.querySelector("#game-box");
//botones
const startBtnNode = document.querySelector("#start-btn");
const restartGame = document.querySelector("#restart-game");

/* ··········Variables globales del juego·········· */
//declaramos player-declaramos disparo-parametros comunes
let player = null;
let firePlayer = null;
let fireArr = [];
let playerH = 40;
let playerW = 50;
let fireH = 35;
let fireW = 40;
let positionPlayerX = 50;
let positionPlayerY = 300;
let enemyPlaneArr = [];
let hiScore = "0000";
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
  "Desde tiempos inmemoriables, los habitantes de Aetheria estan en guerra, tu mision es acabar con los enemigos y restaurar de nuevo la paz. Suerte!",
  120
);

//Función principal
function startGame() {
  //actualizar pantallas
  startScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";
  gameOverScreenNode.style.display = "none";

  // añadir elementos al juego
  player = new PlayerPlane(positionPlayerX, positionPlayerY, playerH, playerW);

  //iniciar Intervalo de juego
  gameIntervalId = setInterval(() => {
    gameLoop();
  }, Math.round(1000 / 60));
  enemyPlaneIntervalId = setInterval(() => {
    addEnemyPlane();
  }, 1000);
}

//función bucle
function gameLoop() {
  fireArr.forEach((elem) => {
    elem.fire();
  });
  enemyPlaneArr.forEach((elem) => {
    elem.automaticMovement();
  });
  outFire();
  outEnemyPlane();
  detectFire();
}

//añadimos disparos
function addFire() {
  firePlayer = new FirePlayer(fireH, fireW, playerW);
  fireArr.push(firePlayer);
}

// eliminamos disparos en Dom y en js
function outFire() {
  if (fireArr.length === 0) {
    return;
  }
  if (fireArr[0].x >= 900) {
    fireArr[0].node.remove();
    fireArr.splice(0, 1);
  }
}
//añadimos aviones enemigos
function addEnemyPlane() {
  let randomPositionY = Math.floor(Math.random() * 600);
  let newPlane = new EnemyPlane(randomPositionY);
  enemyPlaneArr.push(newPlane);
}
//eliminamos aviones enemigos en DOM y en js
function outEnemyPlane() {
  if (enemyPlaneArr.length === 0) {
    return;
  }
  if (enemyPlaneArr[0].x < 0 - enemyPlaneArr[0].w) {
    enemyPlaneArr[0].node.remove();
    enemyPlaneArr.splice(0, 1);
  }
}

//detectamos disparos en avones enemigos y los borramos del DOM
function detectFire() {
  enemyPlaneArr.forEach((elem) => {
    if (
      fireArr[0].x < elem.x + elem.w &&
      fireArr[0].x + fireArr[0].w > elem.x &&
      fireArr[0].y < elem.y + elem.h &&
      fireArr[0].y + fireArr[0].h > elem.y
    ) {
      elem.node.remove();
      fireArr[0].node.remove();
      fireArr.splice(0, 1);
      count();
    }
  });

  //añadimos puntuacion al contador por cada avion enemigo eliminado
  function count() {
    hiScore = hiScore * 50;
    const hiScoreValue = document.getElementById("hiScoreValue");
    hiScoreValue.textContent = hiScore.toString().padStart(4, "0");
    console.log(hiScore);
  }
}

//fin del juego reiniciamos pantallas
function gameOver() {
  clearInterval(gameIntervalId);
  clearInterval(enemyPlaneIntervalId);
  gameOverScreenNode.style.display = "flex";
  startScreenNode.style.display = "none";
  gameBoxNode.style.display = "none";
}

/* ··········Event Listeners·········· */
startBtnNode.addEventListener("click", startGame);
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    player.up();
  }
  if (event.key === "ArrowDown") {
    player.down();
  }
  if (event.code === "Space") {
    addFire();
  }
});
