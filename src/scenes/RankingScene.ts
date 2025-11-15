import type { Game } from "../core/Game";
import type { State } from "../core/State";
import { RankingService } from "../services/RankingService";
import {
  createButton,
  createOverlay,
  createTitle,
  removeOverlay,
} from "../ui/dom";

export class RankingScene implements State {
  readonly id = "ranking";
  private overlay: HTMLDivElement | null = null;

  constructor(
    private readonly game: Game,
    private readonly rankingService: RankingService
  ) {}

  onEnter(): void {
    this.overlay = createOverlay("ranking-overlay");
    this.overlay.classList.add("game-overlay--ranking");

    const panel = document.createElement("div");
    panel.className = "overlay-panel";

    const title = createTitle("Ranking Local");

    const subtitle = document.createElement("p");
    subtitle.className = "overlay-subtitle";
    subtitle.textContent =
      "Maiores distâncias registradas neste navegador. Quem lidera a fuga?";

    const list = document.createElement("ol");
    list.className = "ranking-list";

    const currentPlayer = this.rankingService.getCurrentPlayer();
    const ranking = this.rankingService.loadRanking();

    if (ranking.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "overlay-helper";
      emptyState.textContent =
        "Nenhuma pontuação ainda. Jogue uma vez para aparecer aqui.";
      panel.append(title, subtitle, emptyState);
    } else {
      ranking.forEach((entry, index) => {
        const item = document.createElement("li");
        item.className = "ranking-item";

        const label = document.createElement("span");
        label.className = "ranking-item__label";
        label.textContent = `${index + 1}º  ${entry.nickname}`;

        const scoreBadge = document.createElement("span");
        scoreBadge.className = "ranking-item__score";
        scoreBadge.textContent = `${entry.score} m`;

        item.append(label, scoreBadge);

        if (
          currentPlayer &&
          entry.nickname.toLowerCase() === currentPlayer.toLowerCase()
        ) {
          item.classList.add("ranking-item--current");
        }

        list.appendChild(item);
      });

      panel.append(title, subtitle, list);
    }

    const backButton = createButton("Voltar");
    backButton.classList.add("overlay-button--ghost");
    backButton.addEventListener("click", () => this.game.changeState("menu"));

    panel.append(backButton);

    this.overlay.appendChild(panel);
    document.body.appendChild(this.overlay);
  }

  onExit(): void {
    removeOverlay("ranking-overlay");
    this.overlay = null;
  }

  update(): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#130b32");
    gradient.addColorStop(0.5, "#111428");
    gradient.addColorStop(1, "#050816");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const radial = ctx.createRadialGradient(
      width,
      height,
      0,
      width,
      height,
      Math.max(width, height)
    );
    radial.addColorStop(0, "rgba(255, 208, 102, 0.6)");
    radial.addColorStop(0.4, "rgba(255, 208, 102, 0.0)");
    radial.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  }

  handleInput(event: KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent && event.code === "Escape") {
      this.game.changeState("menu");
    }
  }
}
