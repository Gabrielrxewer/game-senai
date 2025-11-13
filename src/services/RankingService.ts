import { ScoreService } from './ScoreService';

export interface RankingEntry {
  nickname: string;
  score: number;
}

const STORAGE_KEY = 'fuga-academica-ranking';

const DEFAULT_RANKING: RankingEntry[] = [
  { nickname: 'Aluno1', score: 1200 },
  { nickname: 'ProPlayer', score: 3000 },
  { nickname: 'SenaiHero', score: 2200 },
  { nickname: 'FugaMaster', score: 1800 }
];

export class RankingService {
  private currentPlayer: string | null = null;
  private lastScore = 0;

  constructor(private readonly scoreService: ScoreService) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RANKING));
    }
  }

  setCurrentPlayer(nickname: string): void {
    this.currentPlayer = nickname;
  }

  getCurrentPlayer(): string | null {
    return this.currentPlayer;
  }

  setLastScore(score: number): void {
    this.lastScore = score;
  }

  getLastScore(): number {
    return this.lastScore;
  }

  loadRanking(): RankingEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: RankingEntry[] = raw ? JSON.parse(raw) : DEFAULT_RANKING;
    return parsed.sort((a, b) => b.score - a.score);
  }

  saveScore(score: number): void {
    const nickname = this.currentPlayer;
    if (!nickname) {
      return;
    }

    this.scoreService.saveBestScore(score);

    const ranking = this.loadRanking();
    const existing = ranking.find((entry) => entry.nickname === nickname);

    if (existing) {
      existing.score = Math.max(existing.score, score);
    } else {
      ranking.push({ nickname, score });
    }

    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ranking));
  }

  isNicknameAvailable(nickname: string): boolean {
    const ranking = this.loadRanking();
    return !ranking.some((entry) => entry.nickname.toLowerCase() === nickname.toLowerCase());
  }
}
