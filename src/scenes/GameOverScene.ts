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
    this.overlay.classList.add("game-overlay--game-over");

    const panel = document.createElement("div");
    panel.className = "overlay-panel";

    const title = createTitle("Game Over");
    title.classList.add("game-over-title");

    const subtitle = document.createElement("p");
    subtitle.className = "overlay-subtitle";
    subtitle.innerHTML = `
      Boa tentativa, <strong>${nickname}</strong>!<br/>
      <span class="overlay-subtitle-accent">
        O professor te alcançou, mas você ainda pode ir mais longe.
      </span>
    `;

    const summary = document.createElement("p");
    summary.className = "overlay-summary";
    summary.innerHTML = `Distância desta fuga: <strong>${score} m</strong>`;

    const record = document.createElement("p");
    record.className = "overlay-record";
    record.innerHTML = `Recorde atual: <strong>${best} m</strong>`;

    const controller = document.createElement("div");
    controller.className = "game-over-controller";

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.className = "overlay-buttons";

    const retryButton = createButton("Tentar novamente");
    retryButton.addEventListener("click", () => this.game.changeState("game"));

    const menuButton = createButton("Menu");
    menuButton.addEventListener("click", () => this.game.changeState("menu"));

    const rankingButton = createButton("Ranking");
    rankingButton.addEventListener("click", () =>
      this.game.changeState("ranking")
    );

    buttonsWrapper.append(retryButton, menuButton, rankingButton);

    const helper = document.createElement("p");
    helper.className = "overlay-helper";
    helper.textContent = 'Pressione "Espaço" para recomeçar rápido.';

    panel.append(
      title,
      subtitle,
      summary,
      record,
      controller,
      buttonsWrapper,
      helper
    );

    this.overlay.appendChild(panel);
    document.body.appendChild(this.overlay);
  }

  onExit(): void {
    removeOverlay("game-over-overlay");
    this.overlay = null;
  }

  update(): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();

    // fundo parecido com a imagem (roxo/azul com foco rosa)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#130b32");
    gradient.addColorStop(0.5, "#111428");
    gradient.addColorStop(1, "#050816");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // "spotlight" rosa vindo do topo esquerdo
    const radial = ctx.createRadialGradient(
      0,
      0,
      0,
      0,
      0,
      Math.max(width, height)
    );
    radial.addColorStop(0, "rgba(255, 72, 158, 0.85)");
    radial.addColorStop(0.4, "rgba(255, 72, 158, 0.0)");
    radial.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  }

  handleInput(event: KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent && event.code === "Space") {
      this.game.changeState("game");
    }
  }
}
