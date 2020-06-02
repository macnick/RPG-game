/* eslint-disable no-undef */
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

    this.add.text(400, 200, 'Top 6 Warriors', {
      color: 'white',
      fontSize: '32px ',
      fontFamily: 'Georgia',
    }).setOrigin(0.5, 0.5);

    getScores().then((scores) => {
      const scoreStyle = {
        color: 'white',
        fontSize: '16px ',
      };
      scores.sort((a, b) => b.score - a.score);
      const margin = 30;
      for (let i = 0; i < 6; i += 1) {
        if (scores[i] !== undefined) {
          this.add
            .text(
              400,
              240 + margin * i,
              `${i + 1}. ${scores[i].user} ${scores[i].score}`,
              scoreStyle,
            )
            .setOrigin(0.5, 0.5);
        }
      }
    });

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
