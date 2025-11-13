import type { State } from "./State";

export interface GameConfig {
  width: number;
  height: number;
}

export class Game {
  private currentState: State | null = null;
  private lastTime = 0;
  private readonly context: CanvasRenderingContext2D;
  private readonly config: GameConfig;
  private readonly states = new Map<string, State>();
  private animationFrameId: number | null = null;

  constructor(private readonly canvas: HTMLCanvasElement, config: GameConfig) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context not available.");
    }

    this.context = context;
    this.config = config;
  }

  registerState(state: State): void {
    this.states.set(state.id, state);
  }

  start(initialStateId: string): void {
    this.changeState(initialStateId);
    this.lastTime = performance.now();
    const loop = (time: number) => {
      const deltaTime = (time - this.lastTime) / 1000;
      this.lastTime = time;
      this.update(deltaTime);
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  changeState(nextStateId: string): void {
    const nextState = this.states.get(nextStateId);
    if (!nextState) {
      throw new Error(`State '${nextStateId}' is not registered.`);
    }

    const previousState = this.currentState;
    previousState?.onExit(nextState);
    this.currentState = nextState;
    this.currentState.onEnter(previousState ?? undefined);
  }

  getConfig(): GameConfig {
    return this.config;
  }

  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  private update(deltaTime: number): void {
    this.currentState?.update(deltaTime);
  }

  private render(): void {
    const ctx = this.context;
    ctx.clearRect(0, 0, this.config.width, this.config.height);
    this.currentState?.render(ctx);
  }

  dispatchInput(event: KeyboardEvent | MouseEvent): void {
    this.currentState?.handleInput(event);
  }
}
