const STORAGE_KEY = 'fuga-academica-best-score';
const LAST_NICKNAME_KEY = 'fuga-academica-last-nickname';

export class ScoreService {
  getBestScore(): number {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? Number(stored) : 0;
  }

  saveBestScore(score: number): void {
    const best = this.getBestScore();
    if (score > best) {
      localStorage.setItem(STORAGE_KEY, score.toString());
    }
  }

  getLastNickname(): string | null {
    return localStorage.getItem(LAST_NICKNAME_KEY);
  }

  saveLastNickname(nickname: string): void {
    localStorage.setItem(LAST_NICKNAME_KEY, nickname);
  }
}
