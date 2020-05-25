import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {}

  preload() {
    this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');
    // this.load.image('tiles', 'assets/images/map/spritesheet.png');
    this.load.image('tiles', 'assets/images/map/forest_tileset-32x32.png');
    // this.load.tilemapTiledJSON('map', 'assets/images/map/map.json');
    this.load.tilemapTiledJSON('map', 'assets/images/map/dark_forest.json');

    this.load.spritesheet(
      'player',
      'assets//images/RPGCharacterSprites32x32.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    this.load.image('dragonblue', 'assets/images/dragonblue.png');
    this.load.image('dragonorrange', 'assets/images/dragonorrange.png');
    // display progress bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
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
    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    // remove progress bar when complete
    this.load.on(
      'complete',
      function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
        this.ready();
      }.bind(this)
    );

    // load assets needed in our game
    this.load.image('btn', 'assets/ui/button_small.png');
    this.load.image('phaserLogo', 'assets/logo.png');
    this.load.image('box', 'assets/ui/grey_box.png');
    this.load.image('checkedBox', 'assets/ui/blue_boxCheckmark.png');
    this.load.audio('bgMusic', ['assets/TownTheme.mp3']);
  }

  ready() {
    this.scene.start('Title');
  }
}
