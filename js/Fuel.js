class Fuel {
  constructor(randomPositionYFuel) {
    //valores generales
    this.x = 900;
    this.y = randomPositionYFuel;
    this.h = 40;
    this.w = 50;
    this.speed = 5;
    //Fuel en el DOM
    this.node = document.createElement("img");
    this.node.src = "./images/fuel.gif";
    gameBoxNode.append(this.node);
    //dimensiones
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
    this.node.style.position = "absolute";
  }
  automaticMovementFuel() {
    this.x = this.x - this.speed;
    this.node.style.left = `${this.x}px`;
  }
}
