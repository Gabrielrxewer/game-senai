import type { Game } from "./Game";

export interface State {
  readonly id: string;
  onEnter(previousState?: State): void;
  onExit(nextState?: State): void;
  update(deltaTime: number): void;
  render(context: CanvasRenderingContext2D): void;
  handleInput(event: KeyboardEvent | MouseEvent): void;
}

export type StateFactory = (game: Game) => State;
