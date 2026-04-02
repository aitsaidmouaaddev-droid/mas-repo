import type { PlatformerState } from '../platform.slice';

export interface WorldDescriptor {
  id: string;
  name: string;
  /** Draw full parallax background */
  drawBackground(ctx: CanvasRenderingContext2D, state: PlatformerState, nowMs: number): void;
  /** Draw ground strip */
  drawGround(ctx: CanvasRenderingContext2D, state: PlatformerState): void;
  /** Draw a single elevated platform */
  drawPlatform(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void;
  /** Draw a coin at canvas coords */
  drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, nowMs: number): void;
  /** Draw an enemy at canvas coords */
  drawEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, vx: number, nowMs: number): void;
  /** Draw level-end flag at canvas coords */
  drawFlag(ctx: CanvasRenderingContext2D, x: number, groundY: number): void;
  groundColor: string;
  groundHeight: number;
}
