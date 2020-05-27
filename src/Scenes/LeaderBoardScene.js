import 'phaser';
import config from '../Config/config';
import { getScores } from '../leaderBoard';

export default class LeaderBoardScene extends Phaser.Scene {
  constructor() {
    super('LeaderBoard');
  }

  init() {
    this.scale.fullscreenTarget = document.getElementById(config.parent);
  }

  create() {
    this.back = this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');

    // input
    const text = this.add
      .text(400, 200, 'Brave Warriors', {
        color: 'white',
        fontSize: '32px ',
        fontFamily: 'Georgia',
      })
      .setOrigin(0.5, 0.5);

    const allScores = getScores().then((scores) => console.log(scores.result));
    // console.log(allScores.result);

    const style =
      'background: url(assets/ui/button_small.png); width: 490px; height: 77px; border: none; font: 32px Georgia; color: #fff;';
    const btn = this.add.dom(390, 490, 'button', style, 'Menu');
    btn.addListener('click');

    btn.on('click', (event) => {
      this.model = this.sys.game.globals.model;
      this.model.score = 0;
      this.scene.start('Title');
    });
  }

  ready() {}
}
