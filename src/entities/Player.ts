import type { Game } from '../core/Game';

export class Player {
  private readonly width = 40;
  private readonly height = 50;
  private readonly color = '#ffe066';
  private gravity = 1200;
  private jumpForce = -400;
  private velocityY = 0;
  private readonly groundY: number;
  private readonly startX: number;
  private readonly game: Game;

  public x: number;
  public y: number;

  constructor(game: Game) {
    this.game = game;
    const { height } = game.getConfig();
    this.groundY = height - 80;
    this.startX = 120;
    this.x = this.startX;
    this.y = this.groundY - this.height;
  }

  reset(): void {
    this.x = this.startX;
    this.y = this.groundY - this.height;
    this.velocityY = 0;
  }

  jump(): void {
    if (this.isOnGround()) {
      this.velocityY = this.jumpForce;
    }
  }

  update(deltaTime: number): void {
    this.velocityY += this.gravity * deltaTime;
    this.y += this.velocityY * deltaTime;

    if (this.y + this.height >= this.groundY) {
      this.y = this.groundY - this.height;
      this.velocityY = 0;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = '#1c2541';
    ctx.fillRect(this.x + 8, this.y + 10, this.width - 16, this.height - 20);

    ctx.fillStyle = '#5bc0be';
    ctx.fillRect(this.x + 8, this.y + this.height - 12, this.width - 16, 8);
  }

  getBounds(): DOMRect {
    return new DOMRect(this.x, this.y, this.width, this.height);
  }

  private isOnGround(): boolean {
    return this.y + this.height >= this.groundY - 0.5;
  }
}
