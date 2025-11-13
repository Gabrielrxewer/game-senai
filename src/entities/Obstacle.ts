import type { Game } from "../core/Game";

export class Obstacle {
  private readonly width: number;
  private readonly height: number;
  private readonly color: string;
  public x: number;
  public y: number;

  constructor(private readonly speed: number, game: Game) {
    const { height: canvasHeight, width: canvasWidth } = game.getConfig();
    const obstacleHeights = [60, 80, 100];
    this.height =
      obstacleHeights[Math.floor(Math.random() * obstacleHeights.length)];
    this.width = 40 + Math.random() * 30;
    this.x = canvasWidth + this.width;
    this.y = canvasHeight - 80 - this.height;

    const palette = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2"];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  update(deltaTime: number, baseSpeed: number): void {
    this.x -= (baseSpeed + this.speed) * deltaTime;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(this.x, this.y + this.height - 8, this.width, 8);
  }

  isOffScreen(): boolean {
    return this.x + this.width < 0;
  }

  getBounds(): DOMRect {
    return new DOMRect(this.x, this.y, this.width, this.height);
  }
}
