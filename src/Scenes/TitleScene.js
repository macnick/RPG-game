import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    // Game
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2 - 90,
      'blueButton1',
      'blueButton2',
      'Play',
      'Game'
    );

    // Options
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2,
      'blueButton1',
      'blueButton2',
      'Options',
      'Options'
    );

    // Credits
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 90,
      'blueButton1',
      'blueButton2',
      'Credits',
      'Credits'
    );

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.4, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }
}
