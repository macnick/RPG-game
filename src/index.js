import 'phaser';
import config from './Config/config';
import GameScene from './Scenes/GameScene';
import { BattleScene, UIScene } from './Scenes/BattleScene';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import UserScene from './Scenes/UserScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import GameOverScene from './Scenes/GameOverScene';
import VictoryScene from './Scenes/VictoryScene';
import CreditsScene from './Scenes/CreditsScene';
import Model from './Model';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    const model = new Model();
    this.globals = { model, bgMusic: null };
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('UserScene', UserScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Game', GameScene);
    this.scene.add('GameOver', GameOverScene);
    this.scene.add('Victory', VictoryScene);
    this.scene.add('Battle', BattleScene);
    this.scene.add('UIScene', UIScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
