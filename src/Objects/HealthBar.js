const Green = '#0f0'

// export default class HealthBar {
//   constructor(scene, x, y, width, height) {
//     this.bg = scene.add.rectangle(x, y, width + 2, height + 2, 0, 0.6)
//       .setOrigin(0, 0);

//     this.bar = scene.add.rectangle(x + 1, y + 1, width, height, Green)
//       .setOrigin(0, 0);
//   }

//   add(target) {
//     target.on('healthchange', this.draw, this);
//   }

//   draw(target, change, health, max) {
//     this.bar.displayWidth = Math.max(0, health);
//   }
// }

export default class HealthBar {
  constructor(scene, x, y) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.x = x;
    this.y = y;
    this.value = 100;
    this.p = 75 / 100;
    this.draw();
    scene.add.existing(this.bar);
  }

  decrease(amount) {
    this.value -= amount;
    if (this.value < 0) {
      this.value = 0;
    }
    this.draw();
    return (this.value === 0);
  }

  draw() {
    this.bar.clear();
    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, 79, 16);

    //  Health
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 2, this.y + 2, 75, 12);

    if (this.value < 30) {
      this.bar.fillStyle(0xff0000);
    }
    else {
      this.bar.fillStyle(0x00ff00);
    }
    var d = Math.floor(this.p * this.value);
    this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
  }

}