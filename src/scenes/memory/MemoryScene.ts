import Phaser from 'phaser';
import Card from '@objects/card/Card.ts';
import Pointer = Phaser.Input.Pointer;

export default class MemoryScene extends Phaser.Scene {
  private readonly cardRows = 2;
  private readonly cardColumns = 5;
  private readonly cardKeys: string[] = ['1', '2', '3', '4', '5'];
  private cards: Card[] = [];
  private openedCard: Card | null = null;
  private openedPairsCount = 0;

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
    this.initCards();
  }

  private start() {
    this.openedCard = null;
    this.openedPairsCount = 0;
    this.initCards();
  }

  private createBackground() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0);
  }

  private createCards() {
    for (let value of this.cardKeys) {
      for (let i = 0; i < 2; i++) {
        const card = new Card(this, value);
        this.cards.push(card);
      }
    }

    this.input.on('gameobjectdown', this.onCardClick, this);
  }

  private onCardClick(_: Pointer, card: Card) {
    if (card.getIsOpened()) return;

    if (this.openedCard) {
      if (this.openedCard.getCardKey() === card.getCardKey()) {
        this.openedCard = null;
        this.openedPairsCount += 1;
      } else {
        this.openedCard.close();
        this.openedCard = card;
      }
    } else {
      this.openedCard = card;
    }

    card.open();

    if (this.openedPairsCount === this.cards.length / 2) {
      this.start();
    }
  }

  private getCardPositions() {
    const cardPositions = [];
    const cardPadding = 8;
    const cardTexture = this.textures.get('defaultCard').getSourceImage();
    const cardWidth = cardTexture.width + cardPadding;
    const cardHeight = cardTexture.height + cardPadding;
    const offsetX =
      (this.sys.game.canvas.width - cardWidth * this.cardColumns) / 2 +
      cardWidth / 2;
    const offsetY =
      (this.sys.game.canvas.height - cardHeight * this.cardRows) / 2 +
      cardHeight / 2;

    for (let row = 0; row < this.cardRows; row++) {
      for (let column = 0; column < this.cardColumns; column++) {
        const cardX = offsetX + column * cardWidth;
        const cardY = offsetY + row * cardHeight;

        cardPositions.push({ x: cardX, y: cardY });
      }
    }

    return Phaser.Utils.Array.Shuffle(cardPositions);
  }

  private initCards() {
    const cardPositions = this.getCardPositions();

    this.cards.forEach((card) => {
      const cardPosition = cardPositions.pop();

      if (!cardPosition) return;

      card.close();
      card.setPosition(cardPosition.x, cardPosition.y);
    });
  }
}
