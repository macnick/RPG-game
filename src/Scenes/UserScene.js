import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

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

    // input
    const text = this.add.text(270, 200, 'Please enter your name', {
      color: 'white',
      fontSize: '20px ',
    });

    const input = this.add.dom(400, 300, 'input', {
      type: 'text',
      name: 'nameField',
      fontSize: '32px',
    });
    const style =
      'background: url(assets/ui/button_small.png); width: 490px; height: 77px; border: none; font: 32px Georgia; color: #fff';
    const btn = this.add.dom(400, 400, 'button', style, 'Play Now');
    btn.addListener('click');

    btn.on('click', (event) => {
      console.log('input', input.node.value);
      if (input.node.value) {
        this.welcome = text.setText('Welcome ' + input.node.value);
        this.scene.start('Title');
      }
    });
  }

  ready() {
    // this.scene.start('Title');
  }
}
