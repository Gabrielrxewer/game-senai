
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

  // Player já usa o próprio jumpForce lá no Player.ts

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

  // 🔥 Novo estado de jogo
  private flappyMode = false;
  private flappyTimer = 0;
  private nextSwitchDistance = 100; // alterna a cada 1000 metros aprox.

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

  onExit(): void { }

  update(deltaTime: number): void {
    this.distance += this.speed * deltaTime * 0.1;
    this.speed += 5 * deltaTime;
    this.spawnTimer -= deltaTime;

    // 🧠 Alterna o modo a cada certa distância
    if (this.distance >= this.nextSwitchDistance) {
      this.toggleMode();
    }

    // 🔄 Atualiza o timer do modo flappy
    if (this.flappyMode) {
      this.flappyTimer -= deltaTime;
      if (this.flappyTimer <= 0) {
        this.exitFlappyMode();
      }
    }

    // Spawning de obstáculos (somente no modo normal)
    if (!this.flappyMode && this.spawnTimer <= 0) {
      this.spawnObstacle();
    }


    // Atualizações
    this.player.update(deltaTime);
    this.obstacles.forEach((obstacle) => obstacle.update(deltaTime, this.baseObstacleSpeed + this.speed));


    while (this.obstacles.length > 0 && this.obstacles[0].isOffScreen()) {
      this.obstacles.shift();
    }

    this.updateClouds(deltaTime);

    this.updateDiploma(deltaTime);
    this.updateProfessor(deltaTime);

    // Colisão apenas se não for flappy mode
    if (!this.flappyMode && this.hasCollision()) {
      this.handleGameOver();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();


    ctx.fillStyle = this.flappyMode ? '#003566' : '#1c2541';

    ctx.fillRect(0, 0, width, height);

    this.renderClouds(ctx);


    if (!this.flappyMode) {
      ctx.fillStyle = '#3a506b';
      ctx.fillRect(0, height - this.groundHeight, width, this.groundHeight);
    }


    this.renderDiploma(ctx);
    this.renderProfessor(ctx);

    this.player.render(ctx);
    if (!this.flappyMode) {
      this.obstacles.forEach((obstacle) => obstacle.render(ctx));
    }

    ctx.fillStyle = "#f8ffe5";
    ctx.font = '24px "Segoe UI", sans-serif';
    ctx.fillText(`Distância: ${Math.floor(this.distance)} m`, 32, 48);
    ctx.fillText(`Recorde: ${this.scoreService.getBestScore()} m`, 32, 80);

    if (this.flappyMode) {
      ctx.fillStyle = '#ffd166';
      ctx.fillText('🕊️ Modo Voo!', width / 2 - 60, 60);
    }

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
      if (event instanceof KeyboardEvent) event.preventDefault();
      this.player.jump(); // cada clique/aperto aplica força
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

    this.flappyMode = false;
    this.nextSwitchDistance = 800 + Math.random() * 400;

  }

  // 🕹️ Alterna modo de jogo
  private toggleMode(): void {
    if (this.flappyMode) return; // só entra se estiver no modo normal
    this.enterFlappyMode();
  }

  private enterFlappyMode(): void {
    this.flappyMode = true;
    this.flappyTimer = 3 + Math.random() * 2; // 3–5 segundos de voo
    this.obstacles.length = 0; // limpa obstáculos
    this.player.enableGravity(true);
  }

  private exitFlappyMode(): void {
    this.flappyMode = false;
    this.nextSwitchDistance += 800 + Math.random() * 400; // próxima troca
    this.player.enableGravity(false);
  }

  private updateClouds(deltaTime: number): void {
    this.clouds.forEach((cloud) => {
      cloud.x -= cloud.speed * deltaTime;
      if (cloud.x + cloud.size < 0) {
        cloud.x = this.game.getConfig().width + Math.random() * 200;
        cloud.y = 40 + Math.random() * 150;
        cloud.speed = 40 + Math.random() * 40;
        cloud.size = 80 + Math.random() * 60;
      }
    });
  }
  private spawnObstacle(): void {
    const { height: canvasHeight, width: canvasWidth } = this.game.getConfig();

    this.spawnTimer = Math.max(0.9, this.spawnInterval - this.distance / 500);

    const speed = 20 + Math.random() * 60;
    const gap = 140;
    const minHeight = 60;
    const maxHeight = 120;

    const bottomHeight = minHeight + Math.random() * (maxHeight - minHeight);
    const topHeight = canvasHeight - 80 - gap - bottomHeight;
    const width = 40 + Math.random() * 30;
    const x = canvasWidth + width;

    const bottomObstacle = new Obstacle(
      speed,
      x,
      canvasHeight - 80 - bottomHeight,
      width,
      bottomHeight
    );

    const topObstacle = new Obstacle(
      speed,
      x,
      0,
      width,
      topHeight
    );

    this.obstacles.push(bottomObstacle, topObstacle);
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
}


