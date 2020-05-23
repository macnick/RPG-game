import 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // load images
  }

  create() {
    console.log('in gamescene');
    const map = this.make.tilemap({ key: 'map' });
    console.log('map', map);
    // let tiles = map.addTilesetImage('spritesheet', 'tiles');
    const tiles = map.addTilesetImage('forest_tileset-32x32', 'tiles');
    console.log('tiles', tiles);
    let grass = map.createStaticLayer('Grass', tiles, 0, 0);
    let obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
    obstacles.setCollisionByExclusion([-1]);
    // grass.setScale(2);
    // obstacles.setScale(2);

    this.player = this.physics.add.sprite(50, 100, 'player', 6);
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, obstacles);

    this.cursors = this.input.keyboard.createCursorKeys();
    // camera follow
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;

    //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });

    // animation with key 'right'
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 7, 1, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [2, 8, 2, 14],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [0, 6, 0, 12],
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.spawns = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });
    for (var i = 0; i < 30; i++) {
      var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
      var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
      // parameters are x, y, width, height
      this.spawns.create(x, y, 20, 20);
    }
    this.physics.add.overlap(
      this.player,
      this.spawns,
      this.onMeetEnemy,
      false,
      this
    );
  }

  onMeetEnemy(player, zone) {
    console.log('Met an enemy');
    zone.destroy();
    this.scene.start('Title');
    // this.cameras.fade(1000);
    // start battle
  }

  update(time, delta) {
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
      this.player.flipX = true;
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
      this.player.flipX = false;
      this.player.anims.play('right', true);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
      this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
      this.player.anims.play('down', true);
    } else {
      this.player.anims.stop();
    }
  }
}
