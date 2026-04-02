import type { CharacterDescriptor } from './character.types';
import type { PlatformerState } from '../platform.slice';
import { PLAYER_W, PLAYER_H } from '../platform.slice';
import { hassanSfx } from '../sfx';

// ── Palette ───────────────────────────────────────────────────────────────────
const djellaba = '#4a5a8a'; // slate-blue djellaba
const skin = '#c8845a';
const beard = '#3a2a1a';
const hood = '#3a4870';

function drawHassan(ctx: CanvasRenderingContext2D, state: PlatformerState, nowMs: number): void {
  const x = state.playerX;
  const y = state.playerY;
  const w = PLAYER_W;
  const h = PLAYER_H;

  // Running animation — slight bob
  const bob = state.status === 'running' ? Math.sin(nowMs / 120) * 2 : 0;
  const fy = y + bob;

  ctx.save();

  // Djellaba body (long robe)
  ctx.fillStyle = djellaba;
  ctx.beginPath();
  ctx.moveTo(x + 4, fy + 18);
  ctx.lineTo(x + w - 4, fy + 18);
  ctx.lineTo(x + w, fy + h);
  ctx.lineTo(x, fy + h);
  ctx.closePath();
  ctx.fill();

  // Hood
  ctx.fillStyle = hood;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, fy + 12, w / 2 - 2, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, fy + 10, 9, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Beard
  ctx.fillStyle = beard;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, fy + 16, 7, 5, 0, 0, Math.PI);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#1a0a00';
  ctx.fillRect(x + w / 2 - 5, fy + 7, 3, 3);
  ctx.fillRect(x + w / 2 + 2, fy + 7, 3, 3);

  // Legs (peek under robe while running)
  if (state.status === 'running') {
    const legSwing = Math.sin(nowMs / 100) * 8;
    ctx.fillStyle = '#3a4870';
    ctx.fillRect(x + 8, fy + h - 14, 8, 14 + legSwing / 2);
    ctx.fillRect(x + w - 16, fy + h - 14, 8, 14 - legSwing / 2);
  }

  ctx.restore();
}

export const HASSAN: CharacterDescriptor = {
  id: 'hassan',
  name: 'Hassan',
  flavour: 'Artisan from the medina',
  color: '#4a5a8a',
  draw: drawHassan,
  playJump: hassanSfx.jump,
  playCoin: hassanSfx.coin,
  playDeath: hassanSfx.death,
  playKillEnemy: hassanSfx.killEnemy,
  playLoseLife: hassanSfx.loseLife,
};
