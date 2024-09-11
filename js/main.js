/* ··········Elementos principales del DOM·········· */
//pantallas
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const gameBoxNode = document.querySelector("#game-box");
const textGameOverNode = document.querySelector("#textGameOver");
const hiScoreListNode = document.querySelector("#hiScoreList");
const hiScorePoint = document.querySelector("#hiScorePoint");
const yourScore = document.querySelector("#your-score");
//botones
const startBtnNode = document.querySelector("#start-btn");
const hiScoreBtnNode = document.querySelector("#hiScore-btn");
const restartGameNode = document.querySelector("#restart-game-btn");
const returnGameNode = document.querySelector("#return-game-btn");

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
let local = JSON.parse(localStorage.getItem("HiScore"));
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

//Función principal
function startGame() {
  //actualizar pantallas
  startScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";
  gameOverScreenNode.style.display = "none";
  returnGameNode.style.display = "none";

  // añadir elementos al juego
  player = new PlayerPlane(positionPlayerX, positionPlayerY, playerH, playerW);

  //añadir temporizador
  //pasamos a minutes
  const minutes = Math.floor(timeRemaining / 60)
    .toString()
    .padStart(2, "0");
  //pasamos a segundos
  const seconds = (timeRemaining % 60).toString().padStart(2, "0");
  //mostramos en el DOM
  const timeRemainingContainer = document.getElementById("timeRemaining");
  timeRemainingContainer.innerText = `${minutes}:${seconds}`;
  //generamos el intervalo
  let timerId = setInterval(() => {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeRemaining % 60).toString().padStart(2, "0");
    timeRemainingContainer.innerText = `${minutes}:${seconds}`;

    //console.log(quiz.timeRemaining)
    if (timeRemaining === 0) {
      clearInterval(timerId);
      gameOver();
    }
  }, 1000);

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
  detectCollisionPlayer();
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
        count();
      }
    });
  });
  //añadimos puntuacion al contador por cada avion enemigo eliminado

  const hiScoreValue = document.getElementById("hiScoreValue");
  hiScoreValue.textContent = hiScore.toString().padStart(4, "0");
  function count() {
    hiScore = parseInt(hiScore) + 50;
    const hiScoreValue = document.getElementById("hiScoreValue");
    hiScoreValue.textContent = hiScore.toString().padStart(4, "0");
  }
}

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
      hiScoreArr.push(hiScore);
      showHiScore();
      gameOver();
    }
  });
}

//fin del juego reiniciamos pantallas
function gameOver() {
  clearInterval(gameIntervalId);
  clearInterval(enemyPlaneIntervalId);
  gameOverScreenNode.style.display = "flex";
  gameScreenNode.style.display = "none";
  gameBoxNode.style.display = "none";
}
//guardamos la puntuacion en el local storage
function saveLocalStorage() {
  localStorage.setItem("HiScore", JSON.stringify(hiScoreArr));
}
// mostramos los resultados en pantalla
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
function viewHiScore() {
  showHiScore();
  startScreenNode.style.display = "none";
  textGameOverNode.style.display = "none";
  restartGameNode.style.display = "none";
  gameOverScreenNode.style.display = "flex";
  returnGameNode.style.display = "flex";
}
/* ··········Event Listeners·········· */
startBtnNode.addEventListener("click", startGame);
hiScoreBtnNode.addEventListener("click", viewHiScore);
returnGameNode.addEventListener("click", () => {
  location.reload();
});
restartGameNode.addEventListener("click", () => {
  location.reload();
});
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
