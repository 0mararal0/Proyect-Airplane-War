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
let player = null;
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
  player = new PlayerPlane();

  //iniciar Intervalo de juego
  gameIntervalId = setInterval(() => {
    gameLoop();
  }, Math.round(1000 / 60));

  function gameLoop() {}
}

/* ··········Event Listeners·········· */
startBtnNode.addEventListener("click", startGame);
window.addEventListener("keydown", (event) => {
  console.log(event.key);
  if (event.key === "ArrowUp") {
    player.up();
  }
  if (event.key === "ArrowDown") {
    paddleMovement("left");
  }
});
