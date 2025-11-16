import type { Game } from "../core/Game";
import type { CharacterHitbox, CharacterSkin } from "../data/characters";
import { loadSprite } from "../core/spriteCache";

export class Player {
  private width = 40;
  private height = 50;
  private readonly gravity = 1200;
  private readonly jumpForce = -600;
  private velocityY = 0;
  private readonly groundY: number;
  private readonly startX: number;
  private readonly game: Game;
  private skin: CharacterSkin;
  private sprite: HTMLImageElement | null = null;
  private hitbox: CharacterHitbox = {
    width: 32,
    height: 42,
    offsetX: 4,
    offsetY: 8,
  };
  private frozen = false;

  public x: number;
  public y: number;

  constructor(game: Game, initialSkin: CharacterSkin) {
    this.game = game;
    const { height } = game.getConfig();
    this.groundY = height - 80;
    this.startX = 120;
    this.skin = initialSkin;
    this.width = initialSkin.renderWidth;
    this.height = initialSkin.renderHeight;
    this.hitbox = initialSkin.hitbox;
    this.sprite = loadSprite(initialSkin.spriteUrl);
    this.x = this.startX;
    this.y = this.groundY - this.height;
  }

  setSkin(skin: CharacterSkin): void {
    this.skin = skin;
    this.width = skin.renderWidth;
    this.height = skin.renderHeight;
    this.hitbox = skin.hitbox;
    this.sprite = loadSprite(skin.spriteUrl);
    this.y = this.groundY - this.height;
  }

  reset(): void {
    this.x = this.startX;
    this.y = this.groundY - this.height;
    this.velocityY = 0;
    this.frozen = false;
  }

  jump(): void {
    if (this.frozen) {
      return;
    }
    this.velocityY = this.jumpForce;
  }

  freeze(): void {
    this.frozen = true;
    this.velocityY = 0;
  }

  isFrozen(): boolean {
    return this.frozen;
  }

  unfreeze(): void {
    this.frozen = false;
  }

  update(deltaTime: number): void {
    if (this.frozen) {
      return;
    }

    this.velocityY += this.gravity * deltaTime;
    this.y += this.velocityY * deltaTime;

    if (this.y < 0) {
      this.y = 0;
      this.velocityY = 0;
    }

    if (this.y + this.height >= this.groundY) {
      this.y = this.groundY - this.height;
      this.velocityY = 0;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.sprite && this.sprite.complete) {
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = this.skin.accentColor;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  getBounds(): DOMRect {
    return new DOMRect(
      this.x + this.hitbox.offsetX,
      this.y + this.hitbox.offsetY,
      this.hitbox.width,
      this.hitbox.height
    );
  }
}
