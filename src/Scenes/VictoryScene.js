/* eslint-disable no-undef */
import 'phaser';
import config from '../Config/config';
import { putScore } from '../leaderBoard';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('Victory');
  }

  init() {
    this.scale.fullscreenTarget = document.getElementById(config.parent);
    this.model = this.sys.game.globals.model;
  }

  create() {
    this.back = this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');

    this.add.text(400, 200, 'Victory!', {
      color: 'white',
      fontSize: '32px ',
      fontFamily: 'Georgia',
    }).setOrigin(0.5, 0.5);

    const victory = 'Congratulations brave warrior. You have \nmade it on time to save Arcadia.';
    this.add.text(400, 300, victory, {
      color: 'white',
      fontSize: '24px ',
    }).setOrigin(0.5, 0.5);

    this.add.text(400, 400, `Score: ${this.model.score}`, {
      color: 'white',
      fontSize: '32px ',
    }).setOrigin(0.5, 0.5);

    putScore(this.model.userName, this.model.score);

    const style = 'background: url(assets/ui/button_small.png); width: 490px; height: 77px; border: none; font: 32px Georgia; color: #fff;';
    const btn = this.add.dom(390, 490, 'button', style, 'Menu');
    btn.addListener('click');

    btn.on('click', () => {
      this.model = this.sys.game.globals.model;
      this.model.score = 0;
      this.scene.start('Title');
    });
  }
}