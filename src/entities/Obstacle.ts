import type { Game } from "../core/Game";

export class Obstacle {
  private readonly width: number;
  private readonly gapSize: number;
  private readonly topHeight: number;
  private readonly bottomHeight: number;
  private readonly color: string;
  public x: number;
  public y: number;

  constructor(
    private readonly speed: number,
    game: Game,
    private readonly groundHeight: number
  ) {
    const { height: canvasHeight, width: canvasWidth } = game.getConfig();
    this.width = 70 + Math.random() * 24;
    this.gapSize = 170 + Math.random() * 26;
    const maxGapTop = canvasHeight - this.groundHeight - this.gapSize - 40;
    const gapTop = 30 + Math.random() * Math.max(40, maxGapTop);

    this.topHeight = gapTop;
    const ceiling = canvasHeight - this.groundHeight;
    this.bottomHeight = Math.max(30, ceiling - gapTop - this.gapSize);
    this.x = canvasWidth + this.width;
    this.y = canvasHeight - this.groundHeight - this.bottomHeight;

    const palette = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2"];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  update(deltaTime: number, baseSpeed: number): void {
    this.x -= (baseSpeed + this.speed) * deltaTime;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    // Bottom pillar
    ctx.fillRect(this.x, this.y, this.width, this.bottomHeight);

    // Top pillar
    ctx.fillRect(this.x, 0, this.width, this.topHeight);

    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(this.x, this.y + this.bottomHeight - 8, this.width, 8);
  }

  isOffScreen(): boolean {
    return this.x + this.width < 0;
  }

  getBounds(): DOMRect[] {
    return [
      new DOMRect(this.x, this.y, this.width, this.bottomHeight),
      new DOMRect(this.x, 0, this.width, this.topHeight),
    ];
  }

  getX(): number {
    return this.x;
  }

  getWidth(): number {
    return this.width;
  }

  getGapCenter(): number {
    return this.topHeight + this.gapSize / 2;
  }

  getGapTop(): number {
    return this.topHeight;
  }

  getGapBottom(canvasHeight: number): number {
    return canvasHeight - this.groundHeight - this.bottomHeight;
  }
}
