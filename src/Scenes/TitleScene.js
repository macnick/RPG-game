import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.back = this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');
    // Game
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2 - 90,
      'btn',
      'btn',
      'Play',
      'Game'
    );
    // this.gameButton.scale = 0.75;
    // Options
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2,
      'btn',
      'btn',
      'Options',
      'Options'
    );

    // Credits
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 90,
      'btn',
      'btn',
      'Credits',
      'Credits'
    );

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.3, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }
}
