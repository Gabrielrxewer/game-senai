import { Game } from "./core/Game";
import type { State } from "./core/State";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { RankingScene } from "./scenes/RankingScene";
import { ScoreService } from "./services/ScoreService";
import { RankingService } from "./services/RankingService";

const canvas = document.getElementById(
  "game-canvas"
) as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error("Canvas not found.");
}

const scoreService = new ScoreService();
const rankingService = new RankingService(scoreService);

const game = new Game(canvas, { width: canvas.width, height: canvas.height });

const scenes: State[] = [
  new MenuScene(game, rankingService, scoreService),
  new GameScene(game, scoreService, rankingService),
  new GameOverScene(game, scoreService, rankingService),
  new RankingScene(game, rankingService),
];

scenes.forEach((scene) => game.registerState(scene));

game.start("menu");

window.addEventListener("keydown", (event) => game.dispatchInput(event));
window.addEventListener("mousedown", (event) => game.dispatchInput(event));
window.addEventListener("touchstart", (event) => {
  const touchEvent = new MouseEvent("mousedown", {
    clientX: event.touches[0]?.clientX ?? 0,
    clientY: event.touches[0]?.clientY ?? 0,
  });
  game.dispatchInput(touchEvent);
});
