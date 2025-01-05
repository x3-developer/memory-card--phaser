import './style.css';
import Phaser from 'phaser';
import scenes from './scenes';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: scenes,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});
