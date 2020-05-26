import 'phaser';
import config from '../Config/config';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init() {
    this.scale.fullscreenTarget = document.getElementById(config.parent);
  }

  create() {
    this.back = this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');

    // input
    const text = this.add
      .text(400, 200, 'Game Over', {
        color: 'white',
        fontSize: '32px ',
        fontFamily: 'Georgia',
      })
      .setOrigin(0.5, 0.5);

    const score = this.add
      .text(400, 300, `Score: ${this.sys.game.globals.model.score}`, {
        color: 'white',
        fontSize: '32px ',
      })
      .setOrigin(0.5, 0.5);

    const style =
      'background: url(assets/ui/button_small.png); width: 490px; height: 77px; border: none; font: 32px Georgia; color: #fff;';
    const btn = this.add.dom(390, 400, 'button', style, 'Menu');
    btn.addListener('click');

    btn.on('click', (event) => {
      this.model = this.sys.game.globals.model;
      this.model.score = 0;
      this.scene.start('Title');
    });
  }

  ready() {}
}
