class PlayerPlane {
  constructor() {
    //valores generales
    this.x = 50;
    this.y = 300;
    this.h = 35;
    this.w = 40;

    //Avion en el DOM
    this.node = document.createElement("img");
    this.node.src =
      "./images/pngtree-red-red-plane-small-plane-cartoon-airplane-png-image_450710.jpg";
    gameBoxNode.append(this.node);

    //dimensiones
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`;
    this.node.style.position = "absolute";
  }

  up() {
    this.y--;
    this.node.style.top = `${this.y}px`;
  }
  down() {
    this.y++;
    this.node.style.top = `${this.y}px`;
  }
}
