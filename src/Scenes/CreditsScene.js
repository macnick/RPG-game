/* eslint-disable no-undef */
import 'phaser';
import config from '../Config/config';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    this.back = this.add.image(400, 300, 'background');
    this.add.image(400, 100, 'title');
    const style = { fontSize: '22px', fill: '#fff' };

    this.created = this.add.text(
      0,
      120,
      'Created By: Nick Haralampopoulos',
      style,
    );
    this.line1 = this.add.text(0, 0, 'Final Capstone Project', style);
    this.line2 = this.add.text(0, 0, 'in JavaScipt Curriculum', style);
    this.credits = this.add.text(0, 0, 'Credits', style);
    this.phaser = this.add.text(0, 0, 'Phaser 3', style);
    this.open = this.add.text(0, 0, 'OpenGameArt', style);
    this.tcraft = this.add.text(0, 0, 'TextCraft', style);

    this.zone = this.add.zone(
      config.width / 2,
      config.height / 3,
      config.width,
      config.height,
    );

    Phaser.Display.Align.In.Center(this.created, this.zone);
    Phaser.Display.Align.In.Center(this.line1, this.zone);
    Phaser.Display.Align.In.Center(this.line2, this.zone);
    Phaser.Display.Align.In.Center(this.credits, this.zone);
    Phaser.Display.Align.In.Center(this.phaser, this.zone);
    Phaser.Display.Align.In.Center(this.open, this.zone);
    Phaser.Display.Align.In.Center(this.tcraft, this.zone);

    this.line1.displayOriginY = -30;
    this.line2.displayOriginY = -60;
    this.credits.displayOriginY = -120;
    this.phaser.displayOriginY = -150;
    this.open.displayOriginY = -180;
    this.tcraft.displayOriginY = -210;

    const btnStyle = 'background: url(assets/ui/button_small.png); width: 490px; height: 77px; border: none; font: 32px Georgia; color: #fff;';
    const btn = this.add.dom(390, 490, 'button', btnStyle, 'Menu');
    btn.addListener('click');

    btn.on('click', () => {
      this.model = this.sys.game.globals.model;
      this.model.score = 0;
      this.scene.start('Title');
    });
  }
}
