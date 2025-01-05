import Phaser from 'phaser';

export default class MemoryScene extends Phaser.Scene {
  constructor() {
    super('MemoryScene');
  }
  preload() {
    this.load.image('background', 'assets/backgrounds/background.png');
  }

  create() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0);
  }
}
