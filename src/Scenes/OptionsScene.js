/* eslint-disable no-undef */
import 'phaser';
import Button from '../Objects/Button';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }

  create() {
    const title = { fontFamily: 'Georgia', fontSize: 40 };
    const selection = { fontFamily: 'Tahoma', fontSize: 24 };
    this.model = this.sys.game.globals.model;
    this.back = this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');

    this.text = this.add.text(300, 190, 'Options', title);
    this.musicButton = this.add.image(270, 280, 'checkedBox');
    this.musicText = this.add.text(320, 270, 'Music Enabled', selection);

    this.soundButton = this.add.image(270, 350, 'checkedBox');
    this.soundText = this.add.text(320, 340, 'Sound Enabled', selection);

    this.musicButton.setInteractive();
    this.soundButton.setInteractive();

    this.musicButton.on(
      'pointerdown',
      () => {
        this.model.musicOn = !this.model.musicOn;
        this.updateAudio();
      },
    );

    this.soundButton.on(
      'pointerdown',
      () => {
        this.model.soundOn = !this.model.soundOn;
        this.updateAudio();
      },
    );

    this.menuButton = new Button(this, 400, 480, 'btn', 'btn', 'Menu', 'Title');

    this.updateAudio();
  }

  updateAudio() {
    if (this.model.musicOn === false) {
      this.musicButton.setTexture('box');
      this.sys.game.globals.bgMusic.stop();
      this.model.bgMusicPlaying = false;
    } else {
      this.musicButton.setTexture('checkedBox');
      if (this.model.bgMusicPlaying === false) {
        this.sys.game.globals.bgMusic.play();
        this.model.bgMusicPlaying = true;
      }
    }

    if (this.model.soundOn === false) {
      this.soundButton.setTexture('box');
    } else {
      this.soundButton.setTexture('checkedBox');
    }
  }
}
