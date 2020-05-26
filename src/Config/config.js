import 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
};
