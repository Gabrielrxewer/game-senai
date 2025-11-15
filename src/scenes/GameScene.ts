import type { Game } from "../core/Game";
import type { State } from "../core/State";
import { Player } from "../entities/Player";
import { Obstacle } from "../entities/Obstacle";
import { RankingService } from "../services/RankingService";
import { ScoreService } from "../services/ScoreService";

interface Cloud {
  x: number;
  y: number;
  speed: number;
  size: number;
}

export class GameScene implements State {
  readonly id = "game";
  private readonly player: Player;
  private readonly obstacles: Obstacle[] = [];
  private readonly clouds: Cloud[] = [];

  private spawnTimer = 0;
  private readonly spawnInterval = 1.8;
  private speed = 250;
  private distance = 0;

  private readonly groundHeight = 80;
  private readonly baseObstacleSpeed = 80;

  // Limite inferior (chão) usado por todo mundo
  private readonly groundY: number;

  private readonly gravity = 1200;

  // Diploma (na frente do player)
  private readonly diplomaWidth = 60;
  private readonly diplomaHeight = 30;
  private readonly diplomaOffsetX = 280; // distância à frente do player
  private diplomaY: number;
  private diplomaVelocityY = 0;
  private readonly diplomaFlapForce = -580;

  // Professor (atrás do player)
  private readonly professorWidth = 38;
  private readonly professorHeight = 55;
  private readonly professorOffsetX = 80; // distância atrás do player
  private professorY: number;
  private professorVelocityY = 0;
  private readonly professorFlapForce = -600;

  constructor(
    private readonly game: Game,
    private readonly scoreService: ScoreService,
    private readonly rankingService: RankingService
  ) {
    const { height } = game.getConfig();
    this.groundY = height - this.groundHeight;

    this.player = new Player(game);
    this.createInitialClouds();

    this.diplomaY = this.groundY - this.diplomaHeight;
    this.professorY = this.groundY - this.professorHeight;
  }

  onEnter(): void {
    this.reset();
  }

  onExit(): void {}

  update(deltaTime: number): void {
    this.distance += this.speed * deltaTime * 0.1;
    this.speed += 5 * deltaTime;
    this.spawnTimer -= deltaTime;

    if (this.spawnTimer <= 0) {
      this.spawnObstacle();
    }

    this.player.update(deltaTime);
    this.obstacles.forEach((obstacle) =>
      obstacle.update(deltaTime, this.baseObstacleSpeed + this.speed)
    );

    while (this.obstacles.length > 0 && this.obstacles[0].isOffScreen()) {
      this.obstacles.shift();
    }

    this.clouds.forEach((cloud) => {
      cloud.x -= cloud.speed * deltaTime;
      if (cloud.x + cloud.size < 0) {
        cloud.x = this.game.getConfig().width + Math.random() * 200;
        cloud.y = 40 + Math.random() * 150;
        cloud.speed = 40 + Math.random() * 40;
        cloud.size = 80 + Math.random() * 60;
      }
    });

    this.updateDiploma(deltaTime);
    this.updateProfessor(deltaTime);

    if (this.hasCollision()) {
      this.handleGameOver();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();

    // 🔹 Fundo igual às demais telas (gradiente + quadriculado tech)
    this.renderBackground(ctx, width, height);

    // Nuvens por cima do fundo
    this.renderClouds(ctx);

    // “Chão” (já é desenhado dentro de renderBackground,
    // mas se quiser customizar depois dá pra mexer aqui também)

    // Diploma (na frente do player)
    this.renderDiploma(ctx);

    // Professor (atrás do player)
    this.renderProfessor(ctx);

    // Player e obstáculos
    this.player.render(ctx);
    this.obstacles.forEach((obstacle) => obstacle.render(ctx));

    // HUD (distância, recorde, nickname)
    ctx.fillStyle = "#f8ffe5";
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText(`Distância: ${Math.floor(this.distance)} m`, 32, 48);
    ctx.fillText(`Recorde: ${this.scoreService.getBestScore()} m`, 32, 80);

    const nickname = this.rankingService.getCurrentPlayer();
    if (nickname) {
      ctx.fillText(`Aluno: ${nickname}`, width - 220, 48);
    }
  }

  handleInput(event: KeyboardEvent | MouseEvent): void {
    const isJumpInput =
      event instanceof KeyboardEvent
        ? event.code === "Space" || event.code === "ArrowUp"
        : true;

    if (isJumpInput) {
      if (event instanceof KeyboardEvent) {
        event.preventDefault();
      }

      this.player.jump();

      this.flapDiploma();
      this.flapProfessor();
    }
  }

  private reset(): void {
    this.player.reset();
    this.obstacles.length = 0;
    this.distance = 0;
    this.speed = 250;
    this.spawnTimer = this.spawnInterval;

    this.diplomaY = this.groundY - this.diplomaHeight;
    this.diplomaVelocityY = 0;

    this.professorY = this.groundY - this.professorHeight;
    this.professorVelocityY = 0;
  }

  private spawnObstacle(): void {
    this.spawnTimer = Math.max(0.9, this.spawnInterval - this.distance / 500);
    this.obstacles.push(new Obstacle(Math.random() * 60, this.game));
  }

  private hasCollision(): boolean {
    const playerBounds = this.player.getBounds();
    return this.obstacles.some((obstacle) => {
      const bounds = obstacle.getBounds();
      return (
        playerBounds.x < bounds.x + bounds.width &&
        playerBounds.x + playerBounds.width > bounds.x &&
        playerBounds.y < bounds.y + bounds.height &&
        playerBounds.y + playerBounds.height > bounds.y
      );
    });
  }

  private handleGameOver(): void {
    const score = Math.floor(this.distance);
    this.rankingService.setLastScore(score);
    this.rankingService.saveScore(score);
    this.game.changeState("game-over");
  }

  private flapDiploma(): void {
    this.diplomaVelocityY = this.diplomaFlapForce;
  }

  private updateDiploma(deltaTime: number): void {
    this.diplomaVelocityY += this.gravity * deltaTime;
    this.diplomaY += this.diplomaVelocityY * deltaTime;

    if (this.diplomaY < 0) {
      this.diplomaY = 0;
      this.diplomaVelocityY = 0;
    }

    if (this.diplomaY + this.diplomaHeight >= this.groundY) {
      this.diplomaY = this.groundY - this.diplomaHeight;
      this.diplomaVelocityY = 0;
    }
  }

  private renderDiploma(ctx: CanvasRenderingContext2D): void {
    const diplomaX = this.player.x + this.diplomaOffsetX;
    const diplomaY = this.diplomaY;

    ctx.fillStyle = "#ffe066";
    ctx.fillRect(diplomaX, diplomaY, this.diplomaWidth, this.diplomaHeight);
    ctx.strokeStyle = "#d4a418";
    ctx.lineWidth = 4;
    ctx.strokeRect(diplomaX, diplomaY, this.diplomaWidth, this.diplomaHeight);

    ctx.fillStyle = "#ef476f";
    ctx.beginPath();
    ctx.arc(
      diplomaX + this.diplomaWidth - 10,
      diplomaY + this.diplomaHeight / 2,
      8,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#f8ffe5";
    ctx.font = '14px "Segoe UI", sans-serif';
    ctx.fillText("Diploma", diplomaX - 10, diplomaY + this.diplomaHeight + 20);
  }

  // --- FLAPPY PROFESSOR ---
  private flapProfessor(): void {
    this.professorVelocityY = this.professorFlapForce;
  }

  private updateProfessor(deltaTime: number): void {
    this.professorVelocityY += this.gravity * deltaTime;
    this.professorY += this.professorVelocityY * deltaTime;

    if (this.professorY < 0) {
      this.professorY = 0;
      this.professorVelocityY = 0;
    }

    if (this.professorY + this.professorHeight >= this.groundY) {
      this.professorY = this.groundY - this.professorHeight;
      this.professorVelocityY = 0;
    }
  }

  private renderProfessor(ctx: CanvasRenderingContext2D): void {
    const professorX = this.player.x - this.professorOffsetX;
    const professorY = this.professorY;

    ctx.fillStyle = "#ef476f";
    ctx.fillRect(
      professorX,
      professorY,
      this.professorWidth,
      this.professorHeight
    );

    ctx.fillStyle = "#1c2541";
    ctx.fillRect(professorX + 6, professorY + 10, this.professorWidth - 12, 20);

    ctx.fillStyle = "#ffd166";
    ctx.fillRect(
      professorX + (this.professorWidth - 18) / 2,
      professorY - 8,
      18,
      18
    );
  }

  private createInitialClouds(): void {
    const { width } = this.game.getConfig();
    for (let i = 0; i < 5; i += 1) {
      this.clouds.push({
        x: Math.random() * width,
        y: 40 + Math.random() * 150,
        speed: 40 + Math.random() * 40,
        size: 80 + Math.random() * 60,
      });
    }
  }

  private renderClouds(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    this.clouds.forEach((cloud) => {
      ctx.beginPath();
      ctx.ellipse(
        cloud.x,
        cloud.y,
        cloud.size,
        cloud.size * 0.6,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }

  // 🔹 Fundo tech igual às demais telas (gradiente + grid + chão)
  private renderBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    // Gradiente vertical escuro (mesma vibe do CSS)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#020617");
    gradient.addColorStop(0.7, "#020617");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Quadriculado tech (mesma ideia da .game-overlay::before)
    ctx.save();
    ctx.strokeStyle = "rgba(15, 23, 42, 0.8)";
    ctx.lineWidth = 1;

    const cellSize = 40;
    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // Chão escuro com uma linha de destaque “neon” na borda
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, height - this.groundHeight, width, this.groundHeight);

    ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
    ctx.fillRect(0, height - this.groundHeight, width, 2);
  }
}
