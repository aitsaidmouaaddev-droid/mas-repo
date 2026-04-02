import type { CharacterDescriptor } from './character.types';
import type { PlatformerState } from '../platform.slice';
import { PLAYER_W, PLAYER_H } from '../platform.slice';
import { fatimaSfx } from '../sfx';

// ── Palette ───────────────────────────────────────────────────────────────────
const caftan = '#c0507a'; // rose caftan
const sash = '#f0c040'; // gold sash
const skin = '#c8845a';
const hair = '#1a0a00';
const headscarf = '#d07090';

function drawFatima(ctx: CanvasRenderingContext2D, state: PlatformerState, nowMs: number): void {
  const x = state.playerX;
  const y = state.playerY;
  const w = PLAYER_W;
  const h = PLAYER_H;

  const bob = state.status === 'running' ? Math.sin(nowMs / 110) * 2 : 0;
  const fy = y + bob;

  ctx.save();

  // Caftan body
  ctx.fillStyle = caftan;
  ctx.beginPath();
  ctx.moveTo(x + 2, fy + 20);
  ctx.lineTo(x + w - 2, fy + 20);
  ctx.lineTo(x + w + 2, fy + h);
  ctx.lineTo(x - 2, fy + h);
  ctx.closePath();
  ctx.fill();

  // Gold sash
  ctx.fillStyle = sash;
  ctx.fillRect(x + 4, fy + 26, w - 8, 6);

  // Headscarf
  ctx.fillStyle = headscarf;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, fy + 9, w / 2, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, fy + 9, 8, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair strands peeking from scarf
  ctx.fillStyle = hair;
  ctx.fillRect(x + 3, fy + 14, 5, 8);
  ctx.fillRect(x + w - 8, fy + 14, 5, 8);

  // Eyes
  ctx.fillStyle = '#1a0a00';
  ctx.fillRect(x + w / 2 - 5, fy + 6, 3, 3);
  ctx.fillRect(x + w / 2 + 2, fy + 6, 3, 3);

  // Smile
  ctx.strokeStyle = '#7a3a1a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + w / 2, fy + 11, 4, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // Legs
  if (state.status === 'running') {
    const legSwing = Math.sin(nowMs / 100) * 8;
    ctx.fillStyle = '#a04060';
    ctx.fillRect(x + 8, fy + h - 14, 8, 14 + legSwing / 2);
    ctx.fillRect(x + w - 16, fy + h - 14, 8, 14 - legSwing / 2);
  }

  ctx.restore();
}

export const FATIMA: CharacterDescriptor = {
  id: 'fatima',
  name: 'Fatima',
  flavour: 'Merchant of the souks',
  color: '#c0507a',
  draw: drawFatima,
  playJump: fatimaSfx.jump,
  playCoin: fatimaSfx.coin,
  playDeath: fatimaSfx.death,
  playKillEnemy: fatimaSfx.killEnemy,
  playLoseLife: fatimaSfx.loseLife,
};
