import type { Game } from '../core/Game';
import type { State } from '../core/State';
import { Player } from '../entities/Player';
import { Obstacle } from '../entities/Obstacle';
import { RankingService } from '../services/RankingService';
import { ScoreService } from '../services/ScoreService';

interface Cloud {
  x: number;
  y: number;
  speed: number;
  size: number;
}

export class GameScene implements State {
  readonly id = 'game';
  private readonly player: Player;
  private readonly obstacles: Obstacle[] = [];
  private readonly clouds: Cloud[] = [];
  private spawnTimer = 0;
  private readonly spawnInterval = 1.8;
  private speed = 250;
  private distance = 0;
  private readonly groundHeight = 80;
  private readonly baseObstacleSpeed = 80;
  private professorOffset = 80;

  constructor(
    private readonly game: Game,
    private readonly scoreService: ScoreService,
    private readonly rankingService: RankingService
  ) {
    this.player = new Player(game);
    this.createInitialClouds();
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
    this.obstacles.forEach((obstacle) => obstacle.update(deltaTime, this.baseObstacleSpeed + this.speed));

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

    this.professorOffset = 80 + Math.sin(performance.now() / 500) * 10;

    if (this.hasCollision()) {
      this.handleGameOver();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();

    ctx.fillStyle = '#1c2541';
    ctx.fillRect(0, 0, width, height);

    this.renderClouds(ctx);

    ctx.fillStyle = '#3a506b';
    ctx.fillRect(0, height - this.groundHeight, width, this.groundHeight);

    this.renderDiploma(ctx);
    this.renderProfessor(ctx);

    this.player.render(ctx);
    this.obstacles.forEach((obstacle) => obstacle.render(ctx));

    ctx.fillStyle = '#f8ffe5';
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText(`Distância: ${Math.floor(this.distance)} m`, 32, 48);
    ctx.fillText(`Recorde: ${this.scoreService.getBestScore()} m`, 32, 80);

    const nickname = this.rankingService.getCurrentPlayer();
    if (nickname) {
      ctx.fillText(`Aluno: ${nickname}`, width - 220, 48);
    }
  }

  handleInput(event: KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent) {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        this.player.jump();
      }
    } else {
      this.player.jump();
    }
  }

  private reset(): void {
    this.player.reset();
    this.obstacles.length = 0;
    this.distance = 0;
    this.speed = 250;
    this.spawnTimer = this.spawnInterval;
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
    this.game.changeState('game-over');
  }

  private renderDiploma(ctx: CanvasRenderingContext2D): void {
    const diplomaX = this.player.x + 280;
    const diplomaY = this.player.y - 40;
    ctx.fillStyle = '#ffe066';
    ctx.fillRect(diplomaX, diplomaY, 60, 30);
    ctx.strokeStyle = '#d4a418';
    ctx.lineWidth = 4;
    ctx.strokeRect(diplomaX, diplomaY, 60, 30);
    ctx.fillStyle = '#ef476f';
    ctx.beginPath();
    ctx.arc(diplomaX + 50, diplomaY + 15, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8ffe5';
    ctx.font = '14px "Segoe UI", sans-serif';
    ctx.fillText('Diploma', diplomaX - 10, diplomaY + 50);
  }

  private renderProfessor(ctx: CanvasRenderingContext2D): void {
    const { height } = this.game.getConfig();
    const professorX = this.player.x - this.professorOffset;
    const professorY = height - this.groundHeight - 55;
    ctx.fillStyle = '#ef476f';
    ctx.fillRect(professorX, professorY, 38, 55);
    ctx.fillStyle = '#1c2541';
    ctx.fillRect(professorX + 6, professorY + 10, 26, 20);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(professorX + 10, professorY - 8, 18, 18);
  }

  private createInitialClouds(): void {
    const { width } = this.game.getConfig();
    for (let i = 0; i < 5; i += 1) {
      this.clouds.push({
        x: Math.random() * width,
        y: 40 + Math.random() * 150,
        speed: 40 + Math.random() * 40,
        size: 80 + Math.random() * 60
      });
    }
  }

  private renderClouds(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    this.clouds.forEach((cloud) => {
      ctx.beginPath();
      ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
