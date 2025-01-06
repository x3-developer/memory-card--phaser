import Phaser from 'phaser';

export default class Card extends Phaser.GameObjects.Sprite {
  private static DEFAULT_CARD_KEY = 'defaultCard';
  private isOpened = false;
  public position = {
    x: 0,
    y: 0,
    delay: 1000,
  };

  constructor(
    readonly scene: Phaser.Scene,
    private readonly cardKey: string
  ) {
    super(scene, 0, 0, 'defaultCard');

    this.scene.add.existing(this);
    this.setInteractive();
  }

  public init(cardPosition: { x: number; y: number; delay: number }) {
    this.position = cardPosition;
    this.close();
    this.setPosition(-this.width, -this.height);
  }

  public move(cardPosition: {
    x: number;
    y: number;
    delay: number;
    callback?: () => void;
  }) {
    const animation = {
      targets: this,
      ease: 'Linear',
      duration: 250,
    };

    this.scene.tweens.add({
      ...animation,
      x: cardPosition.x,
      y: cardPosition.y,
      delay: cardPosition.delay,
      onComplete: () => {
        if (
          'callback' in cardPosition &&
          typeof cardPosition.callback === 'function'
        ) {
          cardPosition.callback();
        }
      },
    });
  }

  public open() {
    if (!this.isOpened) {
      this.isOpened = true;
      this.flip();
    }
  }

  public close() {
    if (this.isOpened) {
      this.isOpened = false;
      this.flip();
    }
  }

  public flip() {
    const animation = {
      targets: this,
      ease: 'Linear',
      duration: 150,
    };

    this.scene.tweens.add({
      ...animation,
      scaleX: 0,
      onComplete: () => {
        const texture = this.isOpened
          ? `card${this.cardKey}`
          : Card.DEFAULT_CARD_KEY;
        this.scene.tweens.add({
          ...animation,
          scaleX: 1,
        });

        this.setTexture(texture);
      },
    });
  }

  public getCardKey() {
    return this.cardKey;
  }

  public getIsOpened() {
    return this.isOpened;
  }
}
