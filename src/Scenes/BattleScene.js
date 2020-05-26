import 'phaser';

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
    // player character - warrior
    const warrior = new PlayerCharacter(
      this,
      630,
      60,
      'player',
      69,
      'Warrior',
      100,
      20
    );
    this.add.existing(warrior);
    // player character - knight
    const knight = new PlayerCharacter(
      this,
      630,
      200,
      'player',
      57,
      'Knight',
      110,
      15
    );
    this.add.existing(knight);
    // player character beast
    const beast = new PlayerCharacter(
      this,
      630,
      340,
      'player',
      141,
      'Beast',
      120,
      30
    );
    this.add.existing(beast);

    // Create enemies
    const gnu = new Enemy(this, 220, 130, 'gnu', null, 'Gnu Warrior', 200, 30);
    const andomalius = new Enemy(
      this,
      80,
      90,
      'andomalius',
      null,
      'Andromalius',
      80,
      10
    );

    const mage1 = new Enemy(this, 80, 200, 'mage1', null, 'Mage L1', 50, 15);
    // this.add.existing(mage1);

    const mage2 = new Enemy(this, 80, 310, 'mage2', null, 'Mage L2', 100, 20);
    // this.add.existing(mage2);

    const mage3 = new Enemy(
      this,
      210,
      280,
      'mage3',
      null,
      'SuperMage',
      150,
      25
    );

    this.allEnemies = [gnu, andomalius, mage1, mage2, mage3];

    this.enemies = this.allEnemies.filter((enemy) => {
      if (Math.random() > 0.5) {
        this.add.existing(enemy);
        return enemy;
      }
    });
    console.log(this.enemies);
    // this.add.existing(mage3);
    // array with heroes
    this.heroes = [warrior, knight, beast];
    // array with enemies
    // this.enemies = [gnu, andomalius, mage1, mage2];
    // array with both parties, who will attack
    this.units = this.heroes.concat(this.enemies);
    this.index = -1; // currently active unit
    // Run UI Scene at the same time
    this.scene.run('UIScene');
  }

  nextTurn() {
    // if we have victory or game over
    if (this.checkEndBattle()) {
      this.endBattle();
      return;
    }
    do {
      // currently active unit
      this.index++;
      // if there are no more units, we start again from the first one
      if (this.index >= this.units.length) {
        this.index = 0;
      }
    } while (!this.units[this.index].living);
    // if its player hero
    if (this.units[this.index] instanceof PlayerCharacter) {
      // we need the player to select action and then enemy

      this.events.emit('PlayerSelect', this.index);
    } else {
      // else if its enemy unit
      // pick random living hero to be attacked
      var r;
      do {
        r = Math.floor(Math.random() * this.heroes.length);
      } while (!this.heroes[r].living);
      // call the enemy's attack function
      this.units[this.index].attack(this.heroes[r]);
      // add timer for the next turn, so will have smooth gameplay
      this.time.addEvent({
        delay: 3000,
        callback: this.nextTurn,
        callbackScope: this,
      });
    }
  }
  // check for game over or victory
  checkEndBattle() {
    var victory = true;
    // if all enemies are dead we have victory
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].living) victory = false;
    }
    var gameOver = true;
    // if all heroes are dead we have game over
    for (var i = 0; i < this.heroes.length; i++) {
      if (this.heroes[i].living) gameOver = false;
    }
    return victory || gameOver;
  }
  receivePlayerSelection(action, target) {
    if (action == 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    // next turn in 3 seconds
    this.time.addEvent({
      delay: 3000,
      callback: this.nextTurn,
      callbackScope: this,
    });
  }
  endBattle() {
    // clear state, remove sprites
    this.heroes.length = 0;
    this.enemies.length = 0;
    for (var i = 0; i < this.units.length; i++) {
      // link item
      this.units[i].destroy();
    }
    this.units.length = 0;
    // sleep the UI
    this.scene.sleep('UIScene');
    // return to WorldScene and sleep current BattleScene
    this.scene.switch('Game');
  }
}

// base class for heroes and enemies
var Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Unit(scene, x, y, texture, frame, type, hp, damage) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage; // default damage
    this.living = true;
    this.menuItem = null;
  },
  // we will use this to notify the menu item when the unit is dead
  setMenuItem: function (item) {
    this.menuItem = item;
  },
  // attack the target unit
  attack: function (target) {
    if (target.living) {
      target.takeDamage(this.damage);
      this.scene.events.emit(
        'Message',
        this.type +
          ' attacks ' +
          target.type +
          ' for ' +
          this.damage +
          ' damage'
      );
    }
  },
  takeDamage: function (damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.menuItem.unitKilled();
      this.living = false;
      this.visible = false;
      this.menuItem = null;
    }
  },
});

const Enemy = new Phaser.Class({
  Extends: Unit,

  initialize: function Enemy(scene, x, y, texture, frame, type, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    this.setScale(1.1);
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
    // flip the image so I don"t have to edit it manually
    this.flipX = true;

    this.setScale(1.4);
  },
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize: function MenuItem(x, y, text, scene) {
    Phaser.GameObjects.Text.call(this, scene, x, y, text, {
      color: '#ffffff',
      align: 'left',
      fontFamily: 'Georgia',
      fontSize: 30,
    });
  },

  select: function () {
    this.setColor('#f8ff38');
  },

  deselect: function () {
    this.setColor('#ffffff');
  },
  // when the associated enemy or player unit is killed
  unitKilled: function () {
    this.active = false;
    this.visible = false;
  },
});

// base menu class, container for menu items
const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function Menu(x, y, scene, heroes) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.x = x;
    this.y = y;
    this.selected = false;
  },
  addMenuItem: function (unit) {
    var menuItem = new MenuItem(
      0,
      this.menuItems.length * 40,
      unit,
      this.scene
    );
    this.menuItems.push(menuItem);
    this.add(menuItem);
    return menuItem;
  },
  // menu navigation
  moveSelectionUp: function () {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex--;
      if (this.menuItemIndex < 0)
        this.menuItemIndex = this.menuItems.length - 1;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  moveSelectionDown: function () {
    this.menuItems[this.menuItemIndex].deselect();
    do {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
    } while (!this.menuItems[this.menuItemIndex].active);
    this.menuItems[this.menuItemIndex].select();
  },
  // select the menu as a whole and highlight the choosen element
  select: function (index) {
    if (!index) index = 0;
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    while (!this.menuItems[this.menuItemIndex].active) {
      this.menuItemIndex++;
      if (this.menuItemIndex >= this.menuItems.length) this.menuItemIndex = 0;
      if (this.menuItemIndex == index) return;
    }
    this.menuItems[this.menuItemIndex].select();
    this.selected = true;
  },
  // deselect this menu
  deselect: function () {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
    this.selected = false;
  },
  confirm: function () {
    // when the player confirms his slection, do the action
  },
  // clear menu and remove all menu items
  clear: function () {
    for (var i = 0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },
  // recreate the menu items
  remap: function (units) {
    this.clear();
    for (var i = 0; i < units.length; i++) {
      var unit = units[i];
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
  confirm: function () {
    // we select an action and go to the next menu and choose from the enemies to apply the action
    this.scene.events.emit('SelectedAction');
  },
});

const EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize: function EnemiesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },
  confirm: function () {
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
    this.enemiesMenu = new EnemiesMenu(32, 410, this);
    this.actionsMenu = new ActionsMenu(350, 410, this);
    this.heroesMenu = new HeroesMenu(540, 410, this);
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
    // when the enemy is selected, we deselect all menus and send event with the enemy id
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  }
  onPlayerSelect(id) {
    // when its player turn, we select the active hero item and the first action
    // then we make actions menu active
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }
  // we have action selected and we make the enemies menu active
  // the player needs to choose an enemy to attack
  onSelectedAction() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  }
  remapHeroes() {
    var heroes = this.battleScene.heroes;
    this.heroesMenu.remap(heroes);
  }
  remapEnemies() {
    var enemies = this.battleScene.enemies;
    this.enemiesMenu.remap(enemies);
  }
  onKeyInput(event) {
    if (this.currentMenu && this.currentMenu.selected) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === 'ArrowRight' || event.code === 'Shift') {
      } else if (event.code === 'Space' || event.code === 'ArrowLeft') {
        this.currentMenu.confirm();
      }
    }
  }
}

// the message class extends containter
var Message = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function Message(scene, events) {
    Phaser.GameObjects.Container.call(this, scene, 160, 30);
    var graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);
    graphics.strokeRect(80, 100, 320, 190);
    graphics.fillRect(80, 100, 320, 190);
    this.text = new Phaser.GameObjects.Text(scene, 230, 170, '', {
      color: '#ffffff',
      align: 'center',
      fontFamily: 'Georgia',
      fontSize: 28,
      wordWrap: { width: 250, useAdvancedWrap: true },
    });
    this.add(this.text);
    this.text.setOrigin(0.5);
    events.on('Message', this.showMessage, this);
    this.visible = false;
  },
  showMessage: function (text) {
    this.text.setText(text);
    this.visible = true;
    if (this.hideEvent) this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent({
      delay: 2500,
      callback: this.hideMessage,
      callbackScope: this,
    });
  },
  hideMessage: function () {
    this.hideEvent = null;
    this.visible = false;
  },
});

export { BattleScene, UIScene };
