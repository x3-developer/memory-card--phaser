import Phaser from 'phaser';

export default class Card extends Phaser.GameObjects.Sprite {
  private static DEFAULT_CARD_KEY = 'defaultCard';
  private isOpened = false;

  constructor(
    readonly scene: Phaser.Scene,
    private readonly cardKey: string
  ) {
    super(scene, 0, 0, 'defaultCard');

    this.scene.add.existing(this);
    this.setInteractive();
  }

  public open() {
    this.isOpened = true;
    this.flip(`card${this.cardKey}`);
  }

  public close() {
    this.isOpened = false;
    this.flip(Card.DEFAULT_CARD_KEY);
  }

  public flip(texture: string) {
    const animation = {
      targets: this,
      ease: 'Linear',
      duration: 150,
    };

    this.scene.tweens.add({
      ...animation,
      scaleX: 0,
      onComplete: () => {
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
