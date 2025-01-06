import Phaser from 'phaser';
import Card from '@objects/card/Card.ts';
import Scene = Phaser.Scene;
import Pointer = Phaser.Input.Pointer;
import Text = Phaser.GameObjects.Text;
import { ISound } from '@scenes/memory/types.ts';
import TimerEvent = Phaser.Time.TimerEvent;

export default class MemoryScene extends Scene {
  private readonly cardRows = 2;
  private readonly cardColumns = 5;
  private readonly cardKeys: string[] = ['1', '2', '3', '4', '5'];
  private sounds: ISound | null = null;
  private cards: Card[] = [];
  private openedCard: Card | null = null;
  private openedPairsCount = 0;
  private timeout = 30;
  private timeoutText: Text | null = null;
  private timer: TimerEvent | null = null;

  constructor() {
    super('MemoryScene');
  }
  preload() {
    this.load.image('background', 'assets/backgrounds/background.png');
    this.load.image('defaultCard', 'assets/cards/card_default.png');

    for (let cardKey of this.cardKeys) {
      this.load.image(`card${cardKey}`, `assets/cards/card${cardKey}.png`);
    }

    this.load.audio('theme', 'assets/sounds/theme.mp3');
    this.load.audio('complete', 'assets/sounds/complete.mp3');
    this.load.audio('success', 'assets/sounds/success.mp3');
    this.load.audio('card', 'assets/sounds/card.mp3');
    this.load.audio('timeout', 'assets/sounds/timeout.mp3');
  }

  create() {
    this.createBackground();
    this.createCards();
    this.createSounds();
    this.createTimer();
    this.createText();
    this.start();
  }

  private restart() {
    let animationCount = 0;
    const onCardMoveComplete = () => {
      ++animationCount;

      if (animationCount >= this.cards.length) {
        this.start();
      }
    };

    this.cards.forEach((card) => {
      card.move({
        x: Number(this.sys.game.config.width) + card.width,
        y: Number(this.sys.game.config.height) + card.height,
        delay: card.position.delay,
        callback: onCardMoveComplete,
      });
    });
  }

  private start() {
    this.openedCard = null;
    this.openedPairsCount = 0;
    this.timeout = 30;

    if (this.timer) {
      this.timer.paused = false;
    }

    this.initCards();
    this.showCards();
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

  private createSounds() {
    this.sounds = {
      complete: this.sound.add('complete'),
      success: this.sound.add('success'),
      theme: this.sound.add('theme'),
      timeout: this.sound.add('timeout'),
      card: this.sound.add('card'),
    };

    this.sounds?.theme.play({
      volume: 0.1,
      loop: true,
    });
  }

  private createTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeout -= 1;
        this.timeoutText?.setText(`Time: ${this.timeout}`);

        if (this.timeout <= 0) {
          if (this.timer) {
            this.timer.paused = true;
          }

          this.sounds?.timeout.play();
          this.restart();
        }
      },
      loop: true,
    });
  }

  private createText() {
    this.timeoutText = this.add.text(10, 330, `Time: ${this.timeout}`, {
      font: '36px CurseCasual',
      color: '#ffffff',
    });
  }

  private onCardClick(_: Pointer, card: Card) {
    if (card.getIsOpened()) return;

    this.sounds?.card.play();
    card.open();

    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.openedCard) {
          if (this.openedCard.getCardKey() === card.getCardKey()) {
            this.sounds?.success.play();
            this.openedCard = null;
            this.openedPairsCount += 1;
          } else {
            this.openedCard.close();
            this.openedCard = null;
            card.close();
          }
        } else {
          this.openedCard = card;
        }

        if (this.openedPairsCount === this.cards.length / 2) {
          this.sounds?.complete.play();
          this.restart();
        }
      },
    });
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

    let id = 0;

    for (let row = 0; row < this.cardRows; row++) {
      for (let column = 0; column < this.cardColumns; column++) {
        const cardX = offsetX + column * cardWidth;
        const cardY = offsetY + row * cardHeight;
        ++id;

        cardPositions.push({ x: cardX, y: cardY, delay: id * 100 });
      }
    }

    return Phaser.Utils.Array.Shuffle(cardPositions);
  }

  private initCards() {
    const cardPositions = this.getCardPositions();

    this.cards.forEach((card) => {
      const cardPosition = cardPositions.pop();

      if (!cardPosition) return;

      card.init(cardPosition);
    });
  }

  private showCards() {
    this.cards.forEach((card) => {
      card.depth = card.position.delay;

      card.move({
        x: card.position.x,
        y: card.position.y,
        delay: card.position.delay,
      });
    });
  }
}
