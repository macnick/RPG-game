/* eslint-disable no-undef */
import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('title', 'assets/images/title.png');
    this.load.image('background', 'assets/images/basicBack.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
