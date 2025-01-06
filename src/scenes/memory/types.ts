import Phaser from 'phaser';
import WebAudioSound = Phaser.Sound.WebAudioSound;
import HTML5AudioSound = Phaser.Sound.HTML5AudioSound;
import NoAudioSound = Phaser.Sound.NoAudioSound;

export interface ISound {
  card: NoAudioSound | HTML5AudioSound | WebAudioSound;
  theme: NoAudioSound | HTML5AudioSound | WebAudioSound;
  complete: NoAudioSound | HTML5AudioSound | WebAudioSound;
  success: NoAudioSound | HTML5AudioSound | WebAudioSound;
  timeout: NoAudioSound | HTML5AudioSound | WebAudioSound;
}
