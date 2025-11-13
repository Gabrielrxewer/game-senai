import type { Game } from '../core/Game';
import type { State } from '../core/State';
import { RankingService } from '../services/RankingService';
import { ScoreService } from '../services/ScoreService';
import { createButton, createOverlay, createTitle, removeOverlay } from '../ui/dom';

export class MenuScene implements State {
  readonly id = 'menu';
  private overlay: HTMLDivElement | null = null;
  private errorLabel: HTMLSpanElement | null = null;
  private nicknameInput: HTMLInputElement | null = null;

  constructor(
    private readonly game: Game,
    private readonly rankingService: RankingService,
    private readonly scoreService: ScoreService
  ) {}

  onEnter(): void {
    this.overlay = createOverlay('menu-overlay');

    const title = createTitle('Fuga Acadêmica');
    const subtitle = document.createElement('p');
    subtitle.innerHTML =
      'Ajude o aluno a fugir do professor e chegar o mais longe que puder!<br/>Digite seu nickname para começar.';

    this.nicknameInput = document.createElement('input');
    this.nicknameInput.type = 'text';
    this.nicknameInput.placeholder = 'Digite seu nickname';
    this.nicknameInput.style.padding = '12px 18px';
    this.nicknameInput.style.borderRadius = '9999px';
    this.nicknameInput.style.border = '2px solid #5bc0be';
    this.nicknameInput.style.fontSize = '1rem';
    this.nicknameInput.style.width = '260px';
    this.nicknameInput.maxLength = 16;

    const lastNickname = this.scoreService.getLastNickname();
    if (lastNickname) {
      this.nicknameInput.value = lastNickname;
    }

    this.errorLabel = document.createElement('span');
    this.errorLabel.style.color = '#ef476f';
    this.errorLabel.style.height = '20px';

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.style.display = 'flex';
    buttonsWrapper.style.gap = '16px';

    const playButton = createButton('Jogar');
    playButton.addEventListener('click', () => this.startGame());

    const rankingButton = createButton('Ranking');
    rankingButton.addEventListener('click', () => {
      this.game.changeState('ranking');
    });

    buttonsWrapper.append(playButton, rankingButton);

    this.overlay.append(title, subtitle, this.nicknameInput, this.errorLabel, buttonsWrapper);
    document.body.appendChild(this.overlay);
  }

  onExit(): void {
    if (this.nicknameInput) {
      this.scoreService.saveLastNickname(this.nicknameInput.value.trim());
    }
    removeOverlay('menu-overlay');
    this.overlay = null;
    this.errorLabel = null;
    this.nicknameInput = null;
  }

  update(): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();
    ctx.fillStyle = '#1c2541';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#5bc0be';
    ctx.font = '28px "Segoe UI", sans-serif';
    ctx.fillText('Pressione espaço ou clique em "Jogar" para iniciar', 180, height - 80);
  }

  handleInput(event: KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent && event.code === 'Space') {
      this.startGame();
    }
  }

  private startGame(): void {
    const nickname = this.nicknameInput?.value.trim();
    if (!nickname) {
      this.showError('Digite um nickname para começar.');
      return;
    }

    const currentPlayer = this.rankingService.getCurrentPlayer();
    const nicknameTaken = !this.rankingService.isNicknameAvailable(nickname);

    if (nicknameTaken && (!currentPlayer || currentPlayer.toLowerCase() !== nickname.toLowerCase())) {
      this.showError('Nickname já utilizado no ranking local. Experimente outro.');
      return;
    }

    this.rankingService.setCurrentPlayer(nickname);
    this.scoreService.saveLastNickname(nickname);
    this.game.changeState('game');
  }

  private showError(message: string): void {
    if (this.errorLabel) {
      this.errorLabel.textContent = message;
    }
  }
}
