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
import { CHARACTERS } from "../data/characters";

export class MenuScene implements State {
  readonly id = "menu";
  private overlay: HTMLDivElement | null = null;
  private errorLabel: HTMLSpanElement | null = null;
  private nicknameInput: HTMLInputElement | null = null;
  private selectedCharacterId: string;
  private characterCards: HTMLButtonElement[] = [];

  constructor(
    private readonly game: Game,
    private readonly rankingService: RankingService,
    private readonly scoreService: ScoreService
  ) {
    this.selectedCharacterId = this.rankingService.getSelectedCharacterId();
  }

  onEnter(): void {
    this.overlay = createOverlay("menu-overlay");

    const title = createTitle("Fuga Acadêmica");
    const subtitle = document.createElement("p");
    subtitle.innerHTML =
      "Ajude o aluno a fugir do professor e chegar o mais longe que puder!<br/>Digite seu nickname para começar.";

    this.nicknameInput = document.createElement("input");
    this.nicknameInput.type = "text";
    this.nicknameInput.placeholder = "Digite seu nickname";
    this.nicknameInput.style.padding = "12px 18px";
    this.nicknameInput.style.borderRadius = "9999px";
    this.nicknameInput.style.border = "2px solid #5bc0be";
    this.nicknameInput.style.fontSize = "1rem";
    this.nicknameInput.style.width = "260px";
    this.nicknameInput.maxLength = 16;

    const lastNickname = this.scoreService.getLastNickname();
    if (lastNickname) {
      this.nicknameInput.value = lastNickname;
    }

    this.errorLabel = document.createElement("span");
    this.errorLabel.style.color = "#ef476f";
    this.errorLabel.style.height = "20px";

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.style.display = "flex";
    buttonsWrapper.style.gap = "16px";

    const playButton = createButton("Jogar");
    playButton.addEventListener("click", () => this.startGame());

    const rankingButton = createButton("Ranking");
    rankingButton.addEventListener("click", () => {
      this.game.changeState("ranking");
    });

    buttonsWrapper.append(playButton, rankingButton);

    const selectionWrapper = document.createElement("section");
    selectionWrapper.style.display = "flex";
    selectionWrapper.style.flexDirection = "column";
    selectionWrapper.style.gap = "12px";
    selectionWrapper.style.width = "100%";
    selectionWrapper.style.maxWidth = "720px";

    const selectionTitle = document.createElement("h2");
    selectionTitle.textContent = "Escolha seu personagem";
    selectionTitle.style.margin = "12px 0 0";
    selectionTitle.style.color = "#f8ffe5";

    const selectionSubtitle = document.createElement("p");
    selectionSubtitle.textContent =
      "Cada aluno tem seu próprio estilo indie. Toque para selecionar.";
    selectionSubtitle.style.margin = "0";
    selectionSubtitle.style.color = "#d9e4ff";
    selectionSubtitle.style.fontSize = "0.95rem";

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
    grid.style.gap = "12px";
    grid.style.width = "100%";

    this.characterCards = CHARACTERS.map((character) => {
      const card = document.createElement("button");
      card.type = "button";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.alignItems = "center";
      card.style.gap = "8px";
      card.style.padding = "14px";
      card.style.borderRadius = "18px";
      card.style.background = "rgba(21, 31, 63, 0.65)";
      card.style.border = "2px solid transparent";
      card.style.backdropFilter = "blur(3px)";
      card.style.color = "#fff";
      card.style.cursor = "pointer";
      card.style.transition = "border 0.2s, transform 0.2s";
      card.addEventListener("mouseenter", () => {
        if (this.selectedCharacterId !== character.id) {
          card.style.transform = "translateY(-3px)";
        }
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
      card.addEventListener("click", () => this.setSelectedCharacter(character.id));

      const image = document.createElement("img");
      image.src = character.spriteUrl;
      image.alt = character.name;
      image.width = 68;
      image.height = 68;
      image.style.pointerEvents = "none";

      const name = document.createElement("strong");
      name.textContent = character.name;
      name.style.fontSize = "1rem";

      const titleLabel = document.createElement("span");
      titleLabel.textContent = character.title;
      titleLabel.style.fontSize = "0.8rem";
      titleLabel.style.opacity = "0.85";

      const description = document.createElement("p");
      description.textContent = character.description;
      description.style.fontSize = "0.75rem";
      description.style.margin = "0";
      description.style.opacity = "0.75";

      card.append(image, name, titleLabel, description);
      grid.appendChild(card);
      return card;
    });

    selectionWrapper.append(selectionTitle, selectionSubtitle, grid);

    this.overlay.append(
      title,
      subtitle,
      this.nicknameInput,
      this.errorLabel,
      selectionWrapper,
      buttonsWrapper
    );

    this.syncCharacterCards();
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
    this.characterCards = [];
  }

  update(): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();
    ctx.fillStyle = "#1c2541";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#5bc0be";
    ctx.font = '28px "Segoe UI", sans-serif';
    ctx.fillText(
      'Pressione espaço ou clique em "Jogar" para iniciar',
      180,
      height - 80
    );
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
    this.rankingService.setSelectedCharacter(this.selectedCharacterId);
    this.game.changeState("game");
  }

  private showError(message: string): void {
    if (this.errorLabel) {
      this.errorLabel.textContent = message;
    }
  }

  private setSelectedCharacter(characterId: string): void {
    this.selectedCharacterId = characterId;
    this.rankingService.setSelectedCharacter(characterId);
    this.syncCharacterCards();
  }

  private syncCharacterCards(): void {
    if (!this.characterCards?.length) {
      return;
    }

    this.characterCards.forEach((card, index) => {
      const character = CHARACTERS[index];
      const isSelected = character.id === this.selectedCharacterId;
      card.style.border = isSelected
        ? `2px solid ${character.accentColor}`
        : "2px solid transparent";
      card.style.boxShadow = isSelected
        ? `0 0 16px ${character.accentColor}55`
        : "none";
      card.style.transform = isSelected ? "scale(1.02)" : "scale(1)";
    });
  }
}
