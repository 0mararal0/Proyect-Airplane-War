class PlayerPlane {
  constructor(positionPlayerX, positionPlayerY, playerH, playerW) {
    //valores generales
    this.x = positionPlayerX;
    this.y = positionPlayerY;
    this.h = playerH;
    this.w = playerW;
    this.speed = 5;

    //Avion en el DOM
    this.node = document.createElement("img");
    this.node.src = "./images/plane-ppal.png";
    gameBoxNode.append(this.node);

    //dimensiones
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
    this.node.style.position = "absolute";
  }

  up() {
    this.y = this.y - this.speed;
    this.node.style.top = `${this.y}px`;
  }
  down() {
    this.y = this.y + this.speed;
    this.node.style.top = `${this.y}px`;
  }
}
