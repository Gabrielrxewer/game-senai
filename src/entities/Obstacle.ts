import type { Game } from "../core/Game";

export class Obstacle {
  public x: number;
  public y: number;
  private readonly width: number;
  private readonly height: number;
  private readonly color: string;
  private readonly speed: number;



  constructor(speed: number, x: number, y: number, width: number, height: number,) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

 

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
