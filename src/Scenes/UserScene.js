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

  preload() {
    this.load.html('nameform', 'assets/text/nameform.html');
  }

  create() {
    this.back = this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');

    // input
    const text = this.add.text(270, 200, 'Please enter your name', {
      color: 'white',
      fontSize: '20px ',
    });

    // const element = this.add.dom(400, 300).createFromCache('nameform');
    const input = this.add.dom(400, 300, 'input', {
      type: 'text',
      name: 'nameField',
      fontSize: '32px',
    });
    const btn = this.add.dom(440, 400, 'button', {}, 'Play Now');
    btn.addListener('click');

    btn.on('click', (event) => {
      console.log('input', input.node.value);
      if (input.node.value) {
        this.welcome = text.setText('Welcome ' + input.node.value);
        this.scene.start('Title');
      }
    });

    // buttons
    // this.gameButton = new Button(
    //   this,
    //   config.width / 2,
    //   config.height / 2 - 90,
    //   'btn',
    //   'btn',
    //   '',
    //   'Title'
    // );
    // this.gameButton = new Button(
    //   this,
    //   config.width / 2,
    //   config.height / 2,
    //   'btn',
    //   'btn',
    //   'Enter',
    //   'Title'
    // );
  }

  ready() {
    // this.scene.start('Title');
  }
}
