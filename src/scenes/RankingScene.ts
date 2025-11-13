import type { Game } from '../core/Game';
import type { State } from '../core/State';
import { RankingService } from '../services/RankingService';
import { createButton, createOverlay, createTitle, removeOverlay } from '../ui/dom';

export class RankingScene implements State {
  readonly id = 'ranking';
  private overlay: HTMLDivElement | null = null;

  constructor(private readonly game: Game, private readonly rankingService: RankingService) {}

  onEnter(): void {
    this.overlay = createOverlay('ranking-overlay');

    const title = createTitle('Ranking Local');
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Pontuações mais altas registradas neste navegador.';

    const list = document.createElement('ol');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '0';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '12px';
    list.style.width = '320px';

    const currentPlayer = this.rankingService.getCurrentPlayer();
    const ranking = this.rankingService.loadRanking();

    ranking.forEach((entry, index) => {
      const item = document.createElement('li');
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.padding = '12px 16px';
      item.style.borderRadius = '12px';
      item.style.background = 'rgba(91, 192, 190, 0.15)';
      item.textContent = `${index + 1}º ${entry.nickname}`;

      const scoreBadge = document.createElement('span');
      scoreBadge.textContent = `${entry.score} m`;
      scoreBadge.style.fontWeight = 'bold';
      item.appendChild(scoreBadge);

      if (currentPlayer && entry.nickname.toLowerCase() === currentPlayer.toLowerCase()) {
        item.style.background = 'rgba(239, 71, 111, 0.35)';
        item.style.border = '2px solid #ef476f';
      }

      list.appendChild(item);
    });

    const backButton = createButton('Voltar');
    backButton.addEventListener('click', () => this.game.changeState('menu'));

    this.overlay.append(title, subtitle, list, backButton);
    document.body.appendChild(this.overlay);
  }

  onExit(): void {
    removeOverlay('ranking-overlay');
    this.overlay = null;
  }

  update(): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.game.getConfig();
    ctx.fillStyle = '#1c2541';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#5bc0be';
    ctx.font = '32px "Segoe UI", sans-serif';
    ctx.fillText('Quem lidera a fuga?', 260, height / 2);
  }

  handleInput(event: KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent && event.code === 'Escape') {
      this.game.changeState('menu');
    }
  }
}
