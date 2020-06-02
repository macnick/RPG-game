/* eslint-disable no-undef */
import 'phaser';
import config from '../Config/config';

export default class UserScene extends Phaser.Scene {
  constructor() {
    super('UserScene');
  }

  init() {
    this.scale.fullscreenTarget = document.getElementById(config.parent);
  }

  create() {
    this.back = this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');


    this.add.text(270, 200, 'Please enter your name mac', {
      color: 'white',
      fontSize: '20px ',
    });
    this.add.text(700, 560, 'v.1.0.4b', {
      color: '#fff',
      fontSize: '10px',
    });

    const input = this.add.dom(400, 300, 'input', {
      type: 'text',
      name: 'nameField',
      fontSize: '32px',
    });

    const style = 'background: url(assets/ui/button_small.png); width: 490px; height: 77px; border: none; font: 32px Georgia; color: #fff;';
    const btn = this.add.dom(390, 400, 'button', style, 'Play Now');
    btn.addListener('click');

    btn.on('click', () => {
      if (input.node.value) {
        this.model = this.sys.game.globals.model;
        this.model.userName = input.node.value;
        this.scene.start('Title');
      }
    });
  }
}
