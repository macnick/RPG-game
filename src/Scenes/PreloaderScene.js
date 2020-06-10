/* eslint-disable no-undef */
import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');
    this.load.image('tiles', 'assets/images/map/forest_tileset-32x32.png');
    this.load.tilemapTiledJSON('map', 'assets/images/map/dark_forest.json');
    this.load.image('kn1', 'assets/images/Knight_01.png');
    this.load.image('kn2', 'assets/images/Knight_02.png');
    this.load.image('kn3', 'assets/images/Knight_03.png');
    this.load.spritesheet(
      'player',
      'assets//images/RPGCharacterSprites32x32.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );
    this.load.spritesheet('and', 'assets/images/andromalius-57x88.png', {
      frameWidth: 57,
      frameHeight: 88,
    });
    this.load.spritesheet('gnu', 'assets/images/gnu-120x100.png', {
      frameWidth: 120,
      frameHeight: 100,
    });
    this.load.spritesheet('mage1', 'assets/images/mage-1-85x94.png', {
      frameWidth: 85,
      frameHeight: 94,
    });
    this.load.spritesheet('mage2', 'assets/images/mage-2-122x110.png', {
      frameWidth: 122,
      frameHeight: 110,
    });
    this.load.spritesheet('mage3', 'assets/images/mage-3-87x110.png', {
      frameWidth: 87,
      frameHeight: 110,
    });

    // display progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', (value) => {
      percentText.setText(`${+(value * 100 | 0)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    // remove progress bar when complete
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    });

    // load assets needed in our game
    this.load.image('btn', 'assets/ui/button_small.png');
    this.load.image('box', 'assets/ui/grey_box.png');
    this.load.image('checkedBox', 'assets/ui/blue_boxCheckmark.png');
    this.load.audio('bgMusic', ['assets/heroism.mp3']);
  }

  ready() {
    this.scene.start('UserScene');
  }
}
