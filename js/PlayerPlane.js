class PlayerPlane {
  constructor(positionPlayerX, positionPlayerY, playerH, playerW) {
    //valores generales
    this.x = positionPlayerX;
    this.y = positionPlayerY;
    this.h = playerH;
    this.w = playerW;
    this.speedy = 5;
    this.speedx = 5;

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

  planeMovement(direction) {
    /* const gameBoxWidth = gameBoxNode.offsetWidth - this.w;
    const gameBoxHeight = gameBoxNode.offsetHeight - this.h; */
    if (direction === "right") {
      if (this.x >= 300 - this.w) {
        return;
      } else {
        this.x = this.x + this.speedx;
        this.node.style.left = `${this.x}px`;
      }
    }
    if (direction === "left") {
      if (this.x <= 50) {
        return;
      } else {
        this.x = this.x - this.speedx;
        this.node.style.left = `${this.x}px`;
      }
    }
    if (direction === "up") {
      if (this.y <= 0) {
        return;
      } else {
        this.y = this.y - this.speedy;
        this.node.style.top = `${this.y}px`;
      }
    }
    if (direction === "down") {
      if (this.y >= 600 - this.h) {
        return;
      } else {
        this.y = this.y + this.speedy;
        this.node.style.top = `${this.y}px`;
      }
    }
  }
}
