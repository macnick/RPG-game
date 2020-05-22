import 'phaser';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  preload() {
    // load images
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

    // player character - warrior
    const warrior = new PlayerCharacter(
      this,
      250,
      50,
      'player',
      1,
      'Warrior',
      100,
      20
    );
    this.add.existing(warrior);

    // player character - mage
    const mage = new PlayerCharacter(
      this,
      250,
      100,
      'player',
      4,
      'Mage',
      80,
      8
    );
    this.add.existing(mage);

    const dragonblue = new Enemy(
      this,
      50,
      50,
      'dragonblue',
      null,
      'Dragon',
      50,
      3
    );
    this.add.existing(dragonblue);

    const dragonOrange = new Enemy(
      this,
      50,
      100,
      'dragonorrange',
      null,
      'Dragon2',
      50,
      3
    );
    this.add.existing(dragonOrange);

    // array with heroes
    this.heroes = [warrior, mage];
    // array with enemies
    this.enemies = [dragonblue, dragonOrange];
    // array with both parties, who will attack
    this.units = this.heroes.concat(this.enemies);

    // Run UI Scene at the same time
    this.scene.launch('UIScene');
  }
}

const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Unit(scene, x, y, texture, frame, type, hp, damage) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage; // default damage
  },
  attack: function (target) {
    target.takeDamage(this.damage);
  },
  takeDamage: function (damage) {
    this.hp -= damage;
  },
});

const Enemy = new Phaser.Class({
  Extends: Unit,

  initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
  },
});

const PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize: function PlayerCharacter(
    scene,
    x,
    y,
    texture,
    frame,
    type,
    hp,
    damage
  ) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    // flip the image so I don't have to edit it manually
    this.flipX = true;

    this.setScale(2);
  },
});
