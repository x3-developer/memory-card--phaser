import Phaser from 'phaser';

export default class Card extends Phaser.GameObjects.Sprite {
  private static DEFAULT_CARD_KEY = 'defaultCard';
  private isOpened = false;

  constructor(
    readonly scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly cardKey: string
  ) {
    super(scene, x, y, 'defaultCard');

    this.setOrigin(0, 0);
    this.scene.add.existing(this);
    this.setInteractive();
  }

  public open() {
    this.isOpened = true;
    this.setTexture(`card${this.cardKey}`);
  }

  public close() {
    this.isOpened = false;
    this.setTexture(Card.DEFAULT_CARD_KEY);
  }

  public getCardKey() {
    return this.cardKey;
  }

  public getIsOpened() {
    return this.isOpened;
  }
}
