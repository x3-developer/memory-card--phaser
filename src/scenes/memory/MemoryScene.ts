import Phaser from 'phaser';
import Card from '@objects/card/Card.ts';
import Pointer = Phaser.Input.Pointer;

export default class MemoryScene extends Phaser.Scene {
  private readonly cardRows = 2;
  private readonly cardColumns = 5;
  private readonly cardKeys: string[] = ['1', '2', '3', '4', '5'];
  private cards: Card[] = [];
  private openedCard: Card | null = null;

  constructor() {
    super('MemoryScene');
  }
  preload() {
    this.load.image('background', 'assets/backgrounds/background.png');
    this.load.image('defaultCard', 'assets/cards/card_default.png');

    for (let cardKey of this.cardKeys) {
      this.load.image(`card${cardKey}`, `assets/cards/card${cardKey}.png`);
    }
  }

  create() {
    this.createBackground();
    this.createCards();
  }

  private createBackground() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0);
  }

  private createCards() {
    const cardPositions = this.getCardPositions();
    Phaser.Utils.Array.Shuffle(cardPositions);

    for (let value of this.cardKeys) {
      for (let i = 0; i < 2; i++) {
        const cardPosition = cardPositions.pop();

        if (cardPosition) {
          const card = new Card(this, cardPosition.x, cardPosition.y, value);
          this.cards.push(card);
        }
      }
    }

    this.input.on('gameobjectdown', this.onCardClick, this);
  }

  private onCardClick(_: Pointer, card: Card) {
    if (card.getIsOpened()) return;

    card.open();

    if (this.openedCard) {
      if (this.openedCard.getCardKey() === card.getCardKey()) {
        this.openedCard = null;
      } else {
        this.openedCard.close();
        this.openedCard = card;
        // card.close();
        // this.openedCard = null;
      }
    } else {
      this.openedCard = card;
    }
  }

  private getCardPositions() {
    const positions = [];
    const cardPadding = 8;
    const cardTexture = this.textures.get('defaultCard').getSourceImage();
    const cardWidth = cardTexture.width + cardPadding;
    const cardHeight = cardTexture.height + cardPadding;
    const offsetX =
      (this.sys.game.canvas.width - cardWidth * this.cardColumns) / 2;
    const offsetY =
      (this.sys.game.canvas.height - cardHeight * this.cardRows) / 2;

    for (let row = 0; row < this.cardRows; row++) {
      for (let column = 0; column < this.cardColumns; column++) {
        const cardX = offsetX + column * cardWidth;
        const cardY = offsetY + row * cardHeight;

        positions.push({ x: cardX, y: cardY });
      }
    }

    return positions;
  }
}
