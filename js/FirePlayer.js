class FirePlayer {
  constructor(fireH, fireW, playerW) {
    //valores generales
    this.x = player.x + playerW;
    this.y = player.y;
    this.h = fireH;
    this.w = fireW;
    this.speedFire = 10;

    //Avion en el DOM
    this.node = document.createElement("img");
    this.node.src = "./images/disparo.png";
    gameBoxNode.append(this.node);

    //dimensiones
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
    this.node.style.position = "absolute";
  }

  fire() {
    this.x += this.speedFire;
    this.node.style.left = `${this.x}px`;
  }
}
