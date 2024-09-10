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
// console.log(textTypewriter("lorewknfep dopen poedn", 300));

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
}
function gameLoop() {
  fireArr.forEach((elem) => {
    elem.fire();
  });
  outFire();
}
function addFire() {
  firePlayer = new FirePlayer(fireH, fireW, playerW);
  fireArr.push(firePlayer);
  console.log("hola", fireArr);
}
function outFire() {
  if (fireArr.length === 0) {
    return;
  }
  if (fireArr[0].x >= 900) {
    fireArr[0].node.remove();
    fireArr.splice(0, 1);
  }
}
/* function moveFires() {
  for (let i in playerFires) {
    fire = playerFires[i];
    fire.x -= 2;
  }
}
function fireObj() {
  playerFires.push({
    x: player.x + 20,
    y: player.y - 10,
    with: 10,
    height: 30,
  });
}
function printFire() {
  let node = document.createElement("div");
  gameBoxNode.append(node);
}
 */
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
