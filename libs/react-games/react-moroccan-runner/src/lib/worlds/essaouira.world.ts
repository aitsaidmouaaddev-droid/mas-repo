import type { WorldDescriptor } from './world.types';
import type { PlatformerState } from '../platform.slice';
import { GROUND_HEIGHT } from '../platform.slice';
import { getDayFraction, lerpRGB, starAlpha } from '../dayNight';

// ── Palette — coastal ramparts ────────────────────────────────────────────────
const C = {
  skyTop: '#5090d0',
  skyBot: '#a0d0f8',
  sea: '#2060a8',
  seaFoam: '#80c0e8',
  cloudFill: '#fff',
  cloudEdge: '#c0e0f8',
  wallMain: '#e8e0c8',
  wallShade: '#c8b890',
  rampart: '#d8d0b0',
  battlements: '#c0b898',
  arch: '#a09060',
  ground: '#d0c090',
  groundLine: '#b0a060',
  sandGrain: '#e0d090',
  platTop: '#b0d0e8',
  platMid: '#80b0d0',
  platBot: '#4080b0',
  platWood: '#a08040',
  coinOuter: '#e8c060',
  coinInner: '#fff080',
  coinGlyph: '#a08020',
  enemyBody: '#e8e0d0',
  enemyWing: '#c0c8d0',
  enemyBeak: '#f0c040',
  enemyEye: '#202020',
  flagPole: '#604020',
  flagCloth: '#e83020',
};

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, nowMs: number, df: number) {
  const topDay = [80, 144, 208] as const;
  const topNight = [10, 16, 50] as const;
  const botDay = [160, 208, 248] as const;
  const botNight = [20, 28, 72] as const;
  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  grad.addColorStop(0, lerpRGB(...topDay, ...topNight, 1 - df));
  grad.addColorStop(1, lerpRGB(...botDay, ...botNight, 1 - df));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  // Animated clouds (fade out at night)
  const cloudAlpha = df * 0.92;
  if (cloudAlpha > 0) {
    const cOff = (nowMs / 12000) * w;
    ctx.save();
    ctx.globalAlpha = cloudAlpha;
    for (let i = 0; i < 4; i++) {
      const cx = ((i * w * 0.28 + cOff) % (w + 200)) - 100;
      const cy = 40 + i * 28;
      ctx.fillStyle = C.cloudFill;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 50, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 32, cy - 8, 36, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx - 26, cy - 4, 30, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, df: number, nowMs: number) {
  const alpha = starAlpha(df);
  if (alpha <= 0) return;
  ctx.save();
  ctx.fillStyle = '#e8f0ff';
  const seeds = [
    67, 191, 313, 433, 523, 619, 727, 829, 919, 1031, 1131, 1241, 1321, 1433, 1531, 1619, 1723,
    1823,
  ];
  for (let i = 0; i < 18; i++) {
    const sx = ((seeds[i] * 137 + 50) % (w - 20)) + 10;
    const sy = ((seeds[i] * 89 + 20) % (h * 0.5)) + 10;
    ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.sin(nowMs / 820 + i * 2.3));
    ctx.beginPath();
    ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawNightOverlay(ctx: CanvasRenderingContext2D, w: number, h: number, df: number) {
  const alpha = (1 - df) * 0.4;
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#04081c';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawSea(ctx: CanvasRenderingContext2D, w: number, h: number, nowMs: number) {
  const groundY = h - GROUND_HEIGHT;
  // Sea behind everything
  ctx.fillStyle = C.sea;
  ctx.fillRect(0, groundY - 80, w, 80);
  // Animated waves
  const wOff = (nowMs / 1800) % (Math.PI * 2);
  ctx.strokeStyle = C.seaFoam;
  ctx.lineWidth = 2;
  for (let row = 0; row < 3; row++) {
    ctx.beginPath();
    const wy = groundY - 70 + row * 24;
    for (let wx = -20; wx < w + 20; wx += 8) {
      const yy = wy + Math.sin(wx / 40 + wOff + row) * 5;
      if (wx === -20) ctx.moveTo(wx, yy);
      else ctx.lineTo(wx, yy);
    }
    ctx.stroke();
  }
}

function drawRamparts(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
  const groundY = h - GROUND_HEIGHT;
  const tileW = 240;
  const off = (camX * 0.55) % tileW;
  for (let tx = -off; tx < w + tileW; tx += tileW) {
    // Main wall
    ctx.fillStyle = C.wallMain;
    ctx.fillRect(tx, groundY - 150, 190, 150);
    // Battlements
    ctx.fillStyle = C.battlements;
    for (let bx = tx; bx < tx + 190; bx += 22) ctx.fillRect(bx, groundY - 164, 14, 16);
    // Arch gate
    ctx.fillStyle = C.arch;
    ctx.fillRect(tx + 72, groundY - 100, 46, 100);
    ctx.beginPath();
    ctx.arc(tx + 95, groundY - 100, 23, Math.PI, 0);
    ctx.lineTo(tx + 118, groundY - 100);
    ctx.lineTo(tx + 72, groundY - 100);
    ctx.closePath();
    ctx.fillStyle = C.arch;
    ctx.fill();
    // Side tower
    ctx.fillStyle = C.rampart;
    ctx.fillRect(tx + 195, groundY - 190, 30, 190);
    ctx.fillStyle = C.battlements;
    for (let bx = tx + 195; bx < tx + 225; bx += 12) ctx.fillRect(bx, groundY - 200, 8, 12);
    // Arrow slit windows
    ctx.fillStyle = '#404840';
    ctx.fillRect(tx + 203, groundY - 150, 6, 18);
    ctx.fillRect(tx + 216, groundY - 150, 6, 18);
  }
}

export const ESSAOUIRA_WORLD: WorldDescriptor = {
  id: 'essaouira',
  name: 'Essaouira',
  groundColor: C.ground,
  groundHeight: GROUND_HEIGHT,

  drawBackground(ctx, state: PlatformerState, nowMs) {
    const { width: w, height: h, cameraX } = state;
    const df = getDayFraction(nowMs);
    drawSky(ctx, w, h, nowMs, df);
    drawStars(ctx, w, h, df, nowMs);
    drawSea(ctx, w, h, nowMs);
    drawRamparts(ctx, w, h, cameraX);
    drawNightOverlay(ctx, w, h, df);
  },

  drawGround(ctx, state) {
    const { width: w, height: h, cameraX, groundSegments } = state;
    const groundY = h - GROUND_HEIGHT;
    for (const [x1, x2] of groundSegments) {
      const sx1 = x1 - cameraX;
      const sx2 = x2 - cameraX;
      if (sx2 < 0 || sx1 > w) continue;
      const grad = ctx.createLinearGradient(0, groundY, 0, h);
      grad.addColorStop(0, C.groundLine);
      grad.addColorStop(0.08, C.ground);
      grad.addColorStop(1, '#a08840');
      ctx.fillStyle = grad;
      ctx.fillRect(sx1, groundY, sx2 - sx1, GROUND_HEIGHT);
      // Sand texture dots
      ctx.fillStyle = C.sandGrain;
      const step = 8;
      const tOff = (((cameraX - x1) % (step * 2)) + step * 2) % (step * 2);
      for (let cx = sx1 - tOff; cx < sx2; cx += step * 2) {
        ctx.fillRect(Math.max(cx, sx1), groundY + 6, 3, 3);
        ctx.fillRect(Math.max(cx + step, sx1), groundY + 14, 3, 3);
      }
      ctx.fillStyle = C.wallShade;
      ctx.fillRect(sx1, groundY, sx2 - sx1, 3);
      ctx.fillStyle = '#e8d8a0';
      ctx.fillRect(sx1, groundY + 1, sx2 - sx1, 1);
    }
  },

  drawPlatform(ctx, x, y, w, h) {
    // Stone ledge with wooden plank feel
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, C.platTop);
    grad.addColorStop(1, C.platMid);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    // Plank lines
    ctx.strokeStyle = C.platWood;
    ctx.lineWidth = 1;
    for (let dx = 20; dx < w; dx += 20) {
      ctx.beginPath();
      ctx.moveTo(x + dx, y);
      ctx.lineTo(x + dx, y + h);
      ctx.stroke();
    }
    ctx.fillStyle = '#c0e0f0';
    ctx.fillRect(x, y, w, 2);
    ctx.fillStyle = C.platBot;
    ctx.fillRect(x, y + h - 2, w, 2);
  },

  drawCoin(ctx, x, y, nowMs) {
    const bounce = Math.sin(nowMs / 380 + x * 0.05) * 3;
    // Pearl-like coin
    const grad = ctx.createRadialGradient(x - 3, y + bounce - 3, 2, x, y + bounce, 10);
    grad.addColorStop(0, C.coinInner);
    grad.addColorStop(1, C.coinOuter);
    ctx.beginPath();
    ctx.arc(x, y + bounce, 10, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    // Anchor glyph
    ctx.strokeStyle = C.coinGlyph;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y + bounce - 2, 3.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y + bounce + 1);
    ctx.lineTo(x, y + bounce + 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 4, y + bounce + 6);
    ctx.lineTo(x + 4, y + bounce + 6);
    ctx.stroke();
  },

  drawEnemy(ctx, x, y, vx, nowMs) {
    // Seagull
    const flap = Math.sin(nowMs / 150) * 8;
    const facing = vx >= 0 ? 1 : -1;
    // Body
    ctx.fillStyle = C.enemyBody;
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 18, 13, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Wings
    ctx.fillStyle = C.enemyWing;
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 16);
    ctx.quadraticCurveTo(x - 6, y + 10 + flap, x - 18, y + 14 + flap);
    ctx.quadraticCurveTo(x, y + 22, x + 6, y + 20);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 16);
    ctx.quadraticCurveTo(x + 42, y + 10 - flap, x + 54, y + 14 - flap);
    ctx.quadraticCurveTo(x + 36, y + 22, x + 30, y + 20);
    ctx.closePath();
    ctx.fill();
    // Head
    ctx.fillStyle = C.enemyBody;
    ctx.beginPath();
    ctx.ellipse(x + 18 + facing * 11, y + 10, 9, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = C.enemyBeak;
    ctx.beginPath();
    ctx.moveTo(x + 18 + facing * 19, y + 10);
    ctx.lineTo(x + 18 + facing * 29, y + 12);
    ctx.lineTo(x + 18 + facing * 19, y + 14);
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.fillStyle = C.enemyEye;
    ctx.beginPath();
    ctx.arc(x + 21 + facing * 10, y + 8, 2, 0, Math.PI * 2);
    ctx.fill();
    // Feet dangling
    ctx.strokeStyle = '#e0c080';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 14, y + 26);
    ctx.lineTo(x + 10, y + 34);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 22, y + 26);
    ctx.lineTo(x + 26, y + 34);
    ctx.stroke();
  },

  drawFlag(ctx, x, groundY) {
    ctx.fillStyle = C.flagPole;
    ctx.fillRect(x - 3, groundY - 120, 6, 120);
    ctx.fillStyle = C.flagCloth;
    ctx.beginPath();
    ctx.moveTo(x + 3, groundY - 120);
    ctx.lineTo(x + 34, groundY - 104);
    ctx.lineTo(x + 3, groundY - 88);
    ctx.closePath();
    ctx.fill();
    // Star
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + 16, groundY - 106, 6, 0, Math.PI * 2);
    ctx.fill();
  },
};
