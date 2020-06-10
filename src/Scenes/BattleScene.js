/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-use-before-define */
import 'phaser';
import HealthBar from '../Objects/HealthBar';

class BattleScene extends Phaser.Scene {
  constructor() {
    super('Battle');
  }

  create() {
    this.back = this.add.image(400, 300, 'background');
    this.startBattle();
    this.sys.events.on('wake', this.startBattle, this);
  }

  startBattle() {
    const warrior = new PlayerCharacter(
      this,
      630,
      60,
      'kn1',
      null,
      'Warrior',
      140,
      25,
    );
    this.add.existing(warrior);
    const knight = new PlayerCharacter(
      this,
      630,
      200,
      'kn2',
      null,
      'Knight',
      145,
      20,
    );
    this.add.existing(knight);
    const beast = new PlayerCharacter(
      this,
      630,
      340,
      'kn3',
      null,
      'Beast',
      135,
      30,
    );
    this.add.existing(beast);

    const gnu = new Enemy(this, 220, 130, 'gnu', null, 'Gnu Warrior', 170, 30);
    const and = new Enemy(this, 80, 90, 'and', null, 'Andromalius', 60, 10);
    const mage1 = new Enemy(this, 80, 200, 'mage1', null, 'Light Mage', 80, 15);
    const mage2 = new Enemy(this, 80, 310, 'mage2', null, 'Dark Mage', 100, 20);
    const mage3 = new Enemy(
      this,
      210,
      280,
      'mage3',
      null,
      'Super Mage',
      120,
      25,
    );

    this.allEnemies = [and, mage1, mage2, gnu, mage3];

    this.enemies = this.allEnemies.filter((enemy) => {
      if (Math.random() > 0.45) {
        this.add.existing(enemy);
        // this.add.existing(enemy.healthBar); // add the health bars
        // enemy.healthBar.draw();
        return enemy;
      }
    });
    if (this.enemies.length === 0) {
      this.enemies = [and];
      this.add.existing(and);
    }

    this.heroes = [warrior, knight, beast];
    this.units = this.heroes.concat(this.enemies);
    this.units.forEach(unit => unit.healthBar.draw());
    this.index = -1; // currently active unit
    this.scene.run('UIScene');
  }

  nextTurn() {
    if (this.checkEndBattle()) {
      this.endBattle(this.checkEndBattle());
      return;
    }
    do {
      this.index += 1;
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);
    if (this.units[this.index] instanceof PlayerCharacter) {
      this.events.emit('PlayerSelect', this.index);
    } else {
      let r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);
      this.units[this.index].attack(this.heroes[r]);
      const hero = this.heroes[r];
      hero.healthBar.decrease(100 * (hero.hp / hero.maxHp));
      hero.healthBar.draw();

      this.time.addEvent({
        delay: 2300,
        callback: this.nextTurn,
        callbackScope: this,
      });
    }
  }

  checkEndBattle() {
    let victory = true;
    for (let i = 0; i < this.enemies.length; i += 1) {
      if (this.enemies[i].living) victory = false;
    }
    let gameOver = true;
    for (let i = 0; i < this.heroes.length; i += 1) {
      if (this.heroes[i].living) gameOver = false;
    }
    if (victory) {
      return 'victory';
    }
    if (gameOver) {
      return 'gameOver';
    }
    return victory || gameOver;
  }

  receivePlayerSelection(action, target) {
    if (action === 'attack') {
      this.units[this.index].attack(this.enemies[target]);

      const enemy = this.enemies[target];
      enemy.healthBar.decrease(100 * (enemy.hp / enemy.maxHp));
      enemy.healthBar.draw();
    }
    this.time.addEvent({
      delay: 2500,
      callback: this.nextTurn,
      callbackScope: this,
    });
  }

  endBattle(result) {
    this.updateScore(this.enemies.length, this.heroes.length);

    this.heroes.length = 0;
    this.enemies.length = 0;
    for (let i = 0; i < this.units.length; i += 1) {
      this.units[i].destroy();
    }
    this.units.length = 0;
    this.index = -1;

    if (result === 'gameOver') {
      this.scene.stop('Game');
      this.scene.sleep('UIScene');
      this.scene.switch('GameOver');
    } else if (result === 'victory') {
      this.scene.sleep('UIScene');
      this.scene.switch('Game');
    }
  }

  updateScore(e, h) {
    let { score } = this.sys.game.globals.model;
    score += (e + h) * 10;
    this.sys.game.globals.model.score = score;
  }
}

const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Unit(scene, x, y, texture, frame, type, hp, damage) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
    this.type = type;
    this.maxHp = hp;
    this.hp = hp;
    this.damage = damage;
    this.living = true;
    this.menuItem = null;
  },

  setMenuItem(item) {
    this.menuItem = item;
  },

  attack(target) {
    if (target.living) {
      target.takeDamage(this.damage);
      this.scene.events.emit(
        'Message',
        `${this.type} attacks ${target.type} for ${this.damage} damage`,
      );
    }
  },
  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
      this.healthBar.rem();
    }
  },
});

const Enemy = new Phaser.Class({
  Extends: Unit,

  initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    this.healthBar = new HealthBar(scene, x - 40, y + 50);
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
    damage,
  ) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    this.flipX = true;
    this.healthBar = new HealthBar(scene, x - 45, y + 30);
  },
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize: function MenuItem(x, y, text, scene) {
    Phaser.GameObjects.Text.call(this, scene, x, y, text, {
      color: '#ffffff',
      align: 'left',
      fontFamily: 'Georgia',
      fontSize: 24,
    });
  },

  select() {
    this.setColor('#f8ff38');
  },

  deselect() {
    this.setColor('#ffffff');
  },

  unitKilled() {
    this.active = false;
    this.visible = false;
  },
});

const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function Menu(x, y, scene) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.x = x;
    this.y = y;
    this.selected = false;
  },
  addMenuItem(unit) {
    const menuItem = new MenuItem(
      0,
      this.menuItems.length * 40,
      unit,
      this.scene,
    );
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  },
  // menu navigation
  moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex -= 1;
      if (this.menuItemIndex < 0) this.menuItemIndex = this.menuItems.length - 1;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex += 1;
      if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  // select the menu as a whole and highlight the choosen element
  select(index) {
    if (!index) index = 0;
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex += 1;
      if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
      if (this.menuItemIndex === index) return;
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  },
  // deselect this menu
  deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  },
  confirm() {
    // when the player confirms his slection, do the action
  },
  // clear menu and remove all menu items
  clear() {
    for (let i = 0; i < this.menuItems.length; i += 1) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  // recreate the menu items
  remap(units) {
    this.clear();
    for (let i = 0; i < units.length; i += 1) {
      const unit = units[i];
      unit.setMenuItem(this.addMenuItem(unit.type));
    }
    this.menuItemIndex = 0;
  },
});

const HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize: function HeroesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },
});

const ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize: function ActionsMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
    this.addMenuItem('Attack');
  },
  confirm() {
    // we select an action and go to the next menu and choose from the enemies to apply the action
    this.scene.events.emit('SelectedAction');
  },
});

const EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize: function EnemiesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },
  confirm() {
    // the player has selected the enemy and we send its id with the event
    this.scene.events.emit('Enemy', this.menuItemIndex);
  },
});

// User Interface scene
class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(2, 398, 282, 200);
    this.graphics.fillRect(2, 398, 282, 200);
    this.graphics.strokeRect(290, 398, 212, 200);
    this.graphics.fillRect(290, 398, 212, 200);
    this.graphics.strokeRect(508, 398, 290, 200);
    this.graphics.fillRect(508, 398, 290, 200);
    // basic container to hold all menus
    this.menus = this.add.container();
    this.enemiesMenu = new EnemiesMenu(32, 405, this);
    this.actionsMenu = new ActionsMenu(350, 405, this);
    this.heroesMenu = new HeroesMenu(540, 405, this);
    // the currently selected menu
    this.currentMenu = this.actionsMenu;

    // add menus to the container
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battleScene = this.scene.get('Battle');
    // listen for keyboard events
    this.input.keyboard.on('keydown', this.onKeyInput, this);

    // when its player cunit turn to move
    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this);

    // when the action on the menu is selected
    // for now we have only one action so we dont send and action id
    this.events.on('SelectedAction', this.onSelectedAction, this);

    // an enemy is selected
    this.events.on('Enemy', this.onEnemy, this);

    // when the scene receives wake event
    this.sys.events.on('wake', this.createMenu, this);

    // the message describing the current action
    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.createMenu();
  }

  createMenu() {
    // map hero menu items to heroes
    this.remapHeroes();
    // map enemies menu items to enemies
    this.remapEnemies();
    // first move
    this.battleScene.nextTurn();
  }

  onEnemy(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  }

  onPlayerSelect(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }

  onSelectedAction() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }

  remapHeroes() {
    const { heroes } = this.battleScene;
    this.heroesMenu.remap(heroes);
  }

  remapEnemies() {
    const { enemies } = this.battleScene;
    this.enemiesMenu.remap(enemies);
  }

  onKeyInput(event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  }
}

// the message class extends containter
const Message = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function Message(scene, events) {
    Phaser.GameObjects.Container.call(this, scene, 160, 30);
    const graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.strokeRect(80, 100, 320, 190);
    graphics.fillRect(80, 100, 320, 190);
    this.text = new Phaser.GameObjects.Text(scene, 230, 170, '', {
      color: '#ffffff',
      align: 'center',
      fontFamily: 'Georgia',
      fontSize: 26,
      wordWrap: { width: 250, useAdvancedWrap: true },
    });
    this.add(this.text);
    this.text.setOrigin(0.5);
    events.on('Message', this.showMessage, this);
    this.visible = false;
  },
  showMessage(text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent({
      delay: 1700,
      callback: this.hideMessage,
      callbackScope: this,
    });
  },
  hideMessage() {
    this.hideEvent = null;
    this.visible = false;
  },
});

export { BattleScene, UIScene };
