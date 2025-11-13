import type { Game } from "../core/Game";
import type { State } from "../core/State";
import { RankingService } from "../services/RankingService";
import { ScoreService } from "../services/ScoreService";
import {
  createButton,
  createOverlay,
  createTitle,
  removeOverlay,
} from "../ui/dom";

export class GameOverScene implements State {
  readonly id = "game-over";
  private overlay: HTMLDivElement | null = null;

  constructor(
    private readonly game: Game,
    private readonly scoreService: ScoreService,
    private readonly rankingService: RankingService
  ) {}

  onEnter(): void {
    const score = this.rankingService.getLastScore();
    const best = this.scoreService.getBestScore();
    const nickname = this.rankingService.getCurrentPlayer() ?? "Aluno";

    this.overlay = createOverlay("game-over-overlay");

    const title = createTitle("Game Over");

    const summary = document.createElement("p");
    summary.innerHTML = `Boa tentativa, <strong>${nickname}</strong>!<br/>Você percorreu <strong>${score} m</strong>.`;

    const record = document.createElement("p");
    record.textContent = `Recorde atual: ${best} m`;

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.style.display = "flex";
    buttonsWrapper.style.gap = "16px";

    const retryButton = createButton("Jogar novamente");
    retryButton.addEventListener("click", () => this.game.changeState("game"));

    const menuButton = createButton("Voltar ao menu");
    menuButton.addEventListener("click", () => this.game.changeState("menu"));

    const rankingButton = createButton("Ranking");
    rankingButton.addEventListener("click", () =>
      this.game.changeState("ranking")
    );

    buttonsWrapper.append(retryButton, menuButton, rankingButton);

    this.overlay.append(title, summary, record, buttonsWrapper);
    document.body.appendChild(this.overlay);
  }

  onExit(): void {
    removeOverlay("game-over-overlay");
    this.overlay = null;
  }

  update(): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();
    ctx.fillStyle = "#1c2541";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ef476f";
    ctx.font = '42px "Segoe UI", sans-serif';
    ctx.fillText("O professor te alcançou!", 220, height / 2);
  }

  handleInput(event: KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent && event.code === "Space") {
      this.game.changeState("game");
    }
  }
}
