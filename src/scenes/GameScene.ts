import type { Game } from "../core/Game";
import type { State } from "../core/State";
import { Player } from "../entities/Player";
import { Obstacle } from "../entities/Obstacle";
import { RankingService } from "../services/RankingService";
import { ScoreService } from "../services/ScoreService";
import {
  CHARACTERS,
  DIPLOMA_SPRITE,
  PROFESSOR_SPRITE,
  type CharacterSkin,
} from "../data/characters";
import { loadSprite } from "../core/spriteCache";

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
  private readonly diplomaScale = 0.65;
  private diplomaWidth: number;
  private diplomaHeight: number;
  private readonly diplomaOffsetX = 280; // distância à frente do player
  private diplomaY: number;
  private diplomaVelocityY = 0;
  private readonly diplomaFlapForce = -580;
  private readonly diplomaSprite: HTMLImageElement;

  // Professor (atrás do player)
  private readonly professorScale = 0.75;
  private professorWidth: number;
  private professorHeight: number;
  private professorDistance = 150;
  private readonly professorMinDistance = 32;
  private readonly professorMaxDistance = 170;
  private readonly professorDriftRate = 18;
  private readonly professorCatchupRate = 110;
  private professorY: number;
  private professorVelocityY = 0;
  private readonly professorFlapForce = -600;
  private readonly professorSprite: HTMLImageElement;

  private studentStuck = false;
  private stuckObstacle: { obstacle: Obstacle; rectIndex: number } | null = null;
  private stuckOffset = 0;

  constructor(
    private readonly game: Game,
    private readonly scoreService: ScoreService,
    private readonly rankingService: RankingService
  ) {
    const { height } = game.getConfig();
    this.groundY = height - this.groundHeight;
    this.player = new Player(game, CHARACTERS[0]);
    this.createInitialClouds();
    this.diplomaWidth = DIPLOMA_SPRITE.width * this.diplomaScale;
    this.diplomaHeight = DIPLOMA_SPRITE.height * this.diplomaScale;
    this.diplomaSprite = loadSprite(DIPLOMA_SPRITE.spriteUrl);
    this.professorWidth = PROFESSOR_SPRITE.width * this.professorScale;
    this.professorHeight = PROFESSOR_SPRITE.height * this.professorScale;
    this.professorSprite = loadSprite(PROFESSOR_SPRITE.spriteUrl);
    this.diplomaY = this.groundY - this.diplomaHeight;
    this.professorY = this.groundY - this.professorHeight;
  }

  onEnter(): void {
    const selectedCharacter = this.getSelectedCharacter();
    this.player.setSkin(selectedCharacter);
    this.reset();
  }

  onExit(): void {}

  update(deltaTime: number): void {
    if (!this.studentStuck) {
      this.distance += this.speed * deltaTime * 0.1;
      this.speed += 5 * deltaTime;
    } else {
      this.speed = Math.max(150, this.speed - 60 * deltaTime);
    }
    this.spawnTimer -= deltaTime;

    if (this.spawnTimer <= 0) {
      this.spawnObstacle();
    }

    this.player.update(deltaTime);
    this.obstacles.forEach((obstacle) =>
      obstacle.update(deltaTime, this.baseObstacleSpeed + this.speed)
    );

    while (this.obstacles.length > 0 && this.obstacles[0].isOffScreen()) {
      if (this.stuckObstacle && this.obstacles[0] === this.stuckObstacle.obstacle) {
        break;
      }
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
    this.updateChaseProgress(deltaTime);

    const collision = this.getCollidingObstacle();
    if (collision && !this.studentStuck) {
      this.triggerChase(collision);
    }

    if (this.studentStuck) {
      this.pinPlayerToObstacle();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();

    ctx.fillStyle = "#1c2541";
    ctx.fillRect(0, 0, width, height);

    this.renderClouds(ctx);

    ctx.fillStyle = "#3a506b";
    ctx.fillRect(0, height - this.groundHeight, width, this.groundHeight);

    this.renderDiploma(ctx);
    this.renderProfessor(ctx);

    this.player.render(ctx);
    this.obstacles.forEach((obstacle) => obstacle.render(ctx));

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

      // Enquanto estiver preso, o aluno não consegue saltar para evitar atravessar o obstáculo
      if (this.studentStuck) {
        return;
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
    this.studentStuck = false;
    this.stuckObstacle = null;
    this.stuckOffset = 0;

    this.professorDistance = this.professorMaxDistance;

    this.diplomaY = this.groundY - this.diplomaHeight;
    this.diplomaVelocityY = 0;

    this.professorY = this.groundY - this.professorHeight;
    this.professorVelocityY = 0;
  }

  private spawnObstacle(): void {
    this.spawnTimer = Math.max(0.9, this.spawnInterval - this.distance / 500);
    this.obstacles.push(new Obstacle(Math.random() * 60, this.game, this.groundHeight));
  }

  private getCollidingObstacle():
    | { obstacle: Obstacle; bounds: DOMRect[]; collidedRect: DOMRect }
    | null {
    const playerBounds = this.player.getBounds();
    for (const obstacle of this.obstacles) {
      const bounds = obstacle.getBounds();
      const collided = bounds.find(
        (rect) =>
          playerBounds.x < rect.x + rect.width &&
          playerBounds.x + playerBounds.width > rect.x &&
          playerBounds.y < rect.y + rect.height &&
          playerBounds.y + playerBounds.height > rect.y
      );
      if (collided) {
        return { obstacle, bounds, collidedRect: collided };
      }
    }
    return null;
  }

  private triggerChase({ obstacle, bounds, collidedRect }: { obstacle: Obstacle; bounds: DOMRect[]; collidedRect: DOMRect }): void {
    this.studentStuck = true;
    this.player.freeze();
    // Garante que o aluno pare exatamente antes do obstáculo
    const obstacleBounds = collidedRect ?? bounds[0];
    const playerBounds = this.player.getBounds();
    const offsetToSprite = playerBounds.x - this.player.x;
    const targetX = obstacleBounds.x - playerBounds.width - offsetToSprite - 6;
    this.stuckOffset = playerBounds.width + offsetToSprite + 6;
    this.stuckObstacle = { obstacle, rectIndex: Math.max(0, bounds.indexOf(obstacleBounds)) };
    this.player.x = Math.max(60, targetX);
  }

  private pinPlayerToObstacle(): void {
    if (!this.stuckObstacle) {
      return;
    }

    const { obstacle, rectIndex } = this.stuckObstacle;
    const rects = obstacle.getBounds();
    const obstacleBounds = rects[Math.min(rects.length - 1, Math.max(0, rectIndex))];
    const targetX = obstacleBounds.x - this.stuckOffset;
    this.player.x = Math.max(60, targetX);
  }

  private handleGameOver(): void {
    const score = Math.floor(this.distance);
    this.rankingService.setLastScore(score);
    this.rankingService.saveScore(score);
    this.game.changeState("game-over");
  }

  private hasProfessorReachedPlayer(): boolean {
    const professorX = this.player.x - this.professorDistance;
    const professorRect = new DOMRect(
      professorX,
      this.professorY,
      this.professorWidth,
      this.professorHeight
    );

    const playerRect = this.player.getBounds();

    const horizontalOverlap =
      professorRect.x + professorRect.width - 8 >= playerRect.x &&
      professorRect.x <= playerRect.x + playerRect.width;
    const verticalOverlap =
      professorRect.y + professorRect.height - 8 >= playerRect.y &&
      professorRect.y <= playerRect.y + playerRect.height + 8;

    return horizontalOverlap && verticalOverlap;
  }

  private flapDiploma(): void {
    this.diplomaVelocityY = this.diplomaFlapForce;
  }

  private updateDiploma(deltaTime: number): void {
    this.diplomaVelocityY += this.gravity * deltaTime;
    this.diplomaY += this.diplomaVelocityY * deltaTime;

    const targetY = this.getFollowerTargetY(
      this.player.x + this.diplomaOffsetX,
      this.diplomaHeight
    );

    if (targetY !== null && this.diplomaY > targetY) {
      this.flapDiploma();
    }

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

    if (this.diplomaSprite.complete) {
      ctx.drawImage(
        this.diplomaSprite,
        diplomaX,
        diplomaY,
        this.diplomaWidth,
        this.diplomaHeight
      );
    } else {
      ctx.fillStyle = "#ffe066";
      ctx.fillRect(diplomaX, diplomaY, this.diplomaWidth, this.diplomaHeight);
    }

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

    const targetY = this.getFollowerTargetY(
      this.player.x - this.professorDistance,
      this.professorHeight
    );

    if (targetY !== null) {
      const professorCenter = this.professorY + this.professorHeight / 2;
      if (professorCenter > targetY + 12 || this.studentStuck) {
        this.flapProfessor();
      }
    }

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
    const professorX = this.player.x - this.professorDistance;
    const professorY = this.professorY;

    if (professorX + this.professorWidth < -40) {
      return;
    }

    if (this.professorSprite.complete) {
      ctx.drawImage(
        this.professorSprite,
        professorX,
        professorY,
        this.professorWidth,
        this.professorHeight
      );
    } else {
      ctx.fillStyle = "#ef476f";
      ctx.fillRect(
        professorX,
        professorY,
        this.professorWidth,
        this.professorHeight
      );
    }

    ctx.fillStyle = "#f8ffe5";
    ctx.font = '14px "Segoe UI", sans-serif';
    ctx.fillText("Professor", professorX, professorY - 10);
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

  private getFollowerTargetY(anchorX: number, followerHeight: number): number | null {
    const { height: canvasHeight } = this.game.getConfig();
    const upcoming = this.obstacles.find(
      (obstacle) => obstacle.getX() + obstacle.getWidth() > anchorX
    );

    if (!upcoming) {
      return this.groundY - followerHeight - 12;
    }

    const gapCenter = upcoming.getGapCenter();
    const gapTop = upcoming.getGapTop();
    const gapBottom = upcoming.getGapBottom(canvasHeight);

    const clampedCenter = Math.max(
      gapTop + followerHeight / 2 + 6,
      Math.min(gapCenter, gapBottom - followerHeight / 2 - 6)
    );

    return clampedCenter - followerHeight / 2;
  }

  private updateChaseProgress(deltaTime: number): void {
    if (this.studentStuck) {
      this.professorDistance = Math.max(
        this.professorMinDistance,
        this.professorDistance - this.professorCatchupRate * deltaTime
      );
      if (this.hasProfessorReachedPlayer()) {
        this.handleGameOver();
      }
    } else {
      this.professorDistance = Math.min(
        this.professorMaxDistance,
        this.professorDistance + this.professorDriftRate * deltaTime
      );
    }

    if (this.hasProfessorReachedPlayer()) {
      this.handleGameOver();
    }
  }

  private getSelectedCharacter(): CharacterSkin {
    const selectedId = this.rankingService.getSelectedCharacterId();
    return CHARACTERS.find((character) => character.id === selectedId) ?? CHARACTERS[0];
  }
}
