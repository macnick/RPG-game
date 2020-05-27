export default class Model {
  constructor() {
    this._soundOn = true;
    this._musicOn = true;
    this._bgMusicPlaying = false;
    this._user = '';
    this._score = 11;
  }

  set musicOn(value) {
    this._musicOn = value;
  }

  get musicOn() {
    return this._musicOn;
  }

  set soundOn(value) {
    this._soundOn = value;
  }

  get soundOn() {
    return this._soundOn;
  }

  set bgMusicPlaying(value) {
    this._bgMusicPlaying = value;
  }

  get bgMusicPlaying() {
    return this._bgMusicPlaying;
  }

  set userName(value) {
    this._user = value;
  }

  get userName() {
    return this._user;
  }

  set score(value) {
    this._score = value;
  }

  get score() {
    return this._score;
  }

  resetScore() {
    this._score = 0;
  }
}
