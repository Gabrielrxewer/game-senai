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

export class MenuScene implements State {
  readonly id = "menu";
  private overlay: HTMLDivElement | null = null;
  private errorLabel: HTMLSpanElement | null = null;
  private nicknameInput: HTMLInputElement | null = null;

  constructor(
    private readonly game: Game,
    private readonly rankingService: RankingService,
    private readonly scoreService: ScoreService
  ) {}

  onEnter(): void {
    this.overlay = createOverlay("menu-overlay");
    this.overlay.classList.add("game-overlay--menu");

    const panel = document.createElement("div");
    panel.className = "overlay-panel";

    const title = createTitle("Fuga Acadêmica");

    const subtitle = document.createElement("p");
    subtitle.className = "overlay-subtitle";
    subtitle.innerHTML =
      "Ajude o aluno a fugir do professor e chegar o mais longe que puder.<br/>" +
      '<span class="overlay-subtitle-accent">Escolha um nickname para entrar na fuga.</span>';

    this.nicknameInput = document.createElement("input");
    this.nicknameInput.type = "text";
    this.nicknameInput.placeholder = "Digite seu nickname";
    this.nicknameInput.maxLength = 16;
    this.nicknameInput.className = "overlay-input";

    const lastNickname = this.scoreService.getLastNickname();
    if (lastNickname) {
      this.nicknameInput.value = lastNickname;
    }

    this.errorLabel = document.createElement("span");
    this.errorLabel.className = "overlay-error";

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.className = "overlay-buttons";

    const playButton = createButton("Jogar");
    playButton.addEventListener("click", () => this.startGame());

    const rankingButton = createButton("Ranking");
    rankingButton.addEventListener("click", () =>
      this.game.changeState("ranking")
    );

    buttonsWrapper.append(playButton, rankingButton);

    const helper = document.createElement("p");
    helper.className = "overlay-helper";
    helper.textContent =
      'Dica: você também pode apertar "Espaço" para começar.';

    panel.append(
      title,
      subtitle,
      this.nicknameInput,
      this.errorLabel,
      buttonsWrapper,
      helper
    );

    this.overlay.appendChild(panel);
    document.body.appendChild(this.overlay);
  }

  onExit(): void {
    if (this.nicknameInput) {
      this.scoreService.saveLastNickname(this.nicknameInput.value.trim());
    }
    removeOverlay("menu-overlay");
    this.overlay = null;
    this.errorLabel = null;
    this.nicknameInput = null;
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
      0,
      0,
      0,
      0,
      0,
      Math.max(width, height)
    );
    radial.addColorStop(0, "rgba(72, 209, 204, 0.7)");
    radial.addColorStop(0.4, "rgba(72, 209, 204, 0.0)");
    radial.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  }

  handleInput(event: KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent && event.code === "Space") {
      this.startGame();
    }
  }

  private startGame(): void {
    const nickname = this.nicknameInput?.value.trim();
    if (!nickname) {
      this.showError("Digite um nickname para começar.");
      return;
    }

    const currentPlayer = this.rankingService.getCurrentPlayer();
    const nicknameTaken = !this.rankingService.isNicknameAvailable(nickname);

    if (
      nicknameTaken &&
      (!currentPlayer || currentPlayer.toLowerCase() !== nickname.toLowerCase())
    ) {
      this.showError(
        "Nickname já utilizado no ranking local. Experimente outro."
      );
      return;
    }

    this.rankingService.setCurrentPlayer(nickname);
    this.scoreService.saveLastNickname(nickname);
    this.game.changeState("game");
  }

  private showError(message: string): void {
    if (this.errorLabel) {
      this.errorLabel.textContent = message;
    }
  }
}
