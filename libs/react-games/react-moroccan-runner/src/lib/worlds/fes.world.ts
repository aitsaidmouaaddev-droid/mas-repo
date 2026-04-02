import type { WorldDescriptor } from './world.types';
import type { PlatformerState } from '../platform.slice';
import { GROUND_HEIGHT } from '../platform.slice';
import { getDayFraction, lerpRGB, starAlpha } from '../dayNight';

// ── Palette — deep blue Fes medina ───────────────────────────────────────────
const C = {
  skyTop: '#0a1a3a',
  skyBot: '#4a7abf',
  hillFar: '#0d2255',
  hillNear: '#1a3a7a',
  wallMain: '#e8d8a0',
  wallShade: '#c4b070',
  roofBlue: '#2a6ab0',
  roofDark: '#1a4a80',
  doorBlue: '#1a4a80',
  doorArch: '#0a2a60',
  tileBlue: '#3a7abf',
  tileLight: '#5a9ad0',
  ground: '#c8b060',
  groundLine: '#a09040',
  platTop: '#5a9ad0',
  platMid: '#3a7abf',
  platBot: '#1a4a80',
  platTile: '#7ab0e0',
  coinOuter: '#c0d0f0',
  coinInner: '#e0eeff',
  coinStar: '#6090d0',
  enemyBody: '#607090',
  enemyBeak: '#e0a020',
  enemyWing: '#4a6080',
  flagPole: '#5a4020',
  flagCloth: '#1a4abf',
};

function drawTilePattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  step: number,
) {
  ctx.strokeStyle = C.tileLight;
  ctx.lineWidth = 0.8;
  for (let dx = 0; dx < w; dx += step) {
    for (let dy = 0; dy < h; dy += step) {
      ctx.strokeRect(x + dx, y + dy, step - 1, step - 1);
    }
  }
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, df: number) {
  const topDay = [10, 26, 58] as const;
  const topNight = [4, 6, 22] as const;
  const botDay = [74, 122, 191] as const;
  const botNight = [12, 18, 60] as const;
  const grad = ctx.createLinearGradient(0, 0, 0, h * 0.8);
  grad.addColorStop(0, lerpRGB(...topDay, ...topNight, 1 - df));
  grad.addColorStop(1, lerpRGB(...botDay, ...botNight, 1 - df));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, df: number, nowMs: number) {
  const alpha = starAlpha(df);
  if (alpha <= 0) return;
  ctx.save();
  const seeds = [
    53, 173, 293, 421, 509, 601, 709, 821, 907, 1019, 1123, 1231, 1307, 1423, 1511, 1601, 1709,
    1801,
  ];
  ctx.fillStyle = '#ddeeff';
  for (let i = 0; i < 18; i++) {
    const sx = ((seeds[i] * 137 + 50) % (w - 20)) + 10;
    const sy = ((seeds[i] * 89 + 20) % (h * 0.5)) + 10;
    ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.sin(nowMs / 900 + i * 1.9));
    ctx.beginPath();
    ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawNightOverlay(ctx: CanvasRenderingContext2D, w: number, h: number, df: number) {
  const alpha = (1 - df) * 0.45;
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#020510';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawHills(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
  const groundY = h - GROUND_HEIGHT;
  ctx.fillStyle = C.hillFar;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  const far: [number, number][] = [
    [0, 0.48],
    [0.1, 0.3],
    [0.22, 0.42],
    [0.35, 0.28],
    [0.5, 0.45],
    [0.65, 0.3],
    [0.78, 0.4],
    [0.9, 0.27],
    [1, 0.48],
  ];
  for (const [px, py] of far) {
    const sx = ((((px * w * 2 - camX * 0.08) % (w * 2)) + w * 2) % (w * 2)) - w / 2;
    ctx.lineTo(sx, groundY - py * groundY);
  }
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = C.hillNear;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  const near: [number, number][] = [
    [0, 0.3],
    [0.12, 0.18],
    [0.26, 0.26],
    [0.4, 0.14],
    [0.55, 0.28],
    [0.68, 0.16],
    [0.82, 0.24],
    [0.92, 0.13],
    [1, 0.3],
  ];
  for (const [px, py] of near) {
    const sx = ((((px * w * 2 - camX * 0.18) % (w * 2)) + w * 2) % (w * 2)) - w / 2;
    ctx.lineTo(sx, groundY - py * groundY);
  }
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();
}

function drawMedinaFes(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
  const groundY = h - GROUND_HEIGHT;
  const tileW = 260;
  const off = (camX * 0.5) % tileW;
  for (let tx = -off; tx < w + tileW; tx += tileW) {
    // Main block
    ctx.fillStyle = C.wallMain;
    ctx.fillRect(tx, groundY - 160, 200, 160);
    // Blue tile roof
    ctx.fillStyle = C.roofBlue;
    ctx.fillRect(tx - 5, groundY - 168, 210, 12);
    drawTilePattern(ctx, tx, groundY - 160, 200, 80, 18);
    // Arch windows
    ctx.fillStyle = C.doorBlue;
    for (let i = 0; i < 3; i++) {
      const wx = tx + 20 + i * 62;
      ctx.fillRect(wx, groundY - 90, 30, 60);
      ctx.beginPath();
      ctx.arc(wx + 15, groundY - 90, 15, Math.PI, 0);
      ctx.lineTo(wx + 30, groundY - 90);
      ctx.lineTo(wx, groundY - 90);
      ctx.closePath();
      ctx.fill();
    }
    // Minaret
    ctx.fillStyle = C.wallShade;
    ctx.fillRect(tx + 210, groundY - 210, 34, 210);
    ctx.fillStyle = C.roofBlue;
    ctx.fillRect(tx + 205, groundY - 218, 44, 10);
    ctx.fillStyle = C.roofDark;
    ctx.beginPath();
    ctx.moveTo(tx + 210, groundY - 218);
    ctx.lineTo(tx + 227, groundY - 248);
    ctx.lineTo(tx + 244, groundY - 218);
    ctx.closePath();
    ctx.fill();
  }
}

export const FES_WORLD: WorldDescriptor = {
  id: 'fes',
  name: 'Fès',
  groundColor: C.ground,
  groundHeight: GROUND_HEIGHT,

  drawBackground(ctx, state: PlatformerState, nowMs) {
    const { width: w, height: h, cameraX } = state;
    const df = getDayFraction(nowMs);
    drawSky(ctx, w, h, df);
    drawStars(ctx, w, h, df, nowMs);
    drawHills(ctx, w, h, cameraX);
    drawMedinaFes(ctx, w, h, cameraX);
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
      grad.addColorStop(0.1, C.ground);
      grad.addColorStop(1, '#806010');
      ctx.fillStyle = grad;
      ctx.fillRect(sx1, groundY, sx2 - sx1, GROUND_HEIGHT);
      // Blue tile edge
      ctx.fillStyle = C.tileBlue;
      ctx.fillRect(sx1, groundY, sx2 - sx1, 4);
      ctx.fillStyle = C.tileLight;
      ctx.fillRect(sx1, groundY + 1, sx2 - sx1, 1);
      // Stone tiles
      const step = 40;
      const tOff = (((cameraX - x1) % step) + step) % step;
      ctx.strokeStyle = C.groundLine;
      ctx.lineWidth = 1;
      for (let cx = sx1 - tOff; cx < sx2; cx += step) {
        ctx.strokeRect(
          Math.max(cx, sx1),
          groundY + 6,
          Math.min(step - 2, sx2 - Math.max(cx, sx1) - 1),
          20,
        );
      }
    }
  },

  drawPlatform(ctx, x, y, w, h) {
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, C.platTop);
    grad.addColorStop(1, C.platMid);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    // Blue tile pattern
    ctx.fillStyle = C.platTile;
    for (let dx = 8; dx < w - 4; dx += 14) {
      ctx.fillRect(x + dx, y + 3, 8, 8);
    }
    ctx.fillStyle = C.tileLight;
    ctx.fillRect(x, y, w, 2);
    ctx.fillStyle = C.platBot;
    ctx.fillRect(x, y + h - 2, w, 2);
  },

  drawCoin(ctx, x, y, nowMs) {
    const bounce = Math.sin(nowMs / 400 + x * 0.04) * 3;
    // Blue mosaic coin
    ctx.beginPath();
    ctx.arc(x, y + bounce, 10, 0, Math.PI * 2);
    ctx.fillStyle = C.coinOuter;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + bounce, 7, 0, Math.PI * 2);
    ctx.fillStyle = C.coinInner;
    ctx.fill();
    // Simple cross pattern
    ctx.fillStyle = C.coinStar;
    ctx.fillRect(x - 1, y + bounce - 5, 2, 10);
    ctx.fillRect(x - 5, y + bounce - 1, 10, 2);
  },

  drawEnemy(ctx, x, y, vx, nowMs) {
    // Rooftop pigeon
    const bob = Math.sin(nowMs / 200) * 2;
    const facing = vx >= 0 ? 1 : -1;
    // Body
    ctx.fillStyle = C.enemyBody;
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 20 + bob, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    // Wing
    ctx.fillStyle = C.enemyWing;
    ctx.beginPath();
    ctx.ellipse(x + 18 - facing * 2, y + 20 + bob, 10, 7, facing * 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = C.enemyBody;
    ctx.beginPath();
    ctx.ellipse(x + 18 + facing * 10, y + 10 + bob, 9, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = C.enemyBeak;
    ctx.beginPath();
    ctx.moveTo(x + 18 + facing * 18, y + 10 + bob);
    ctx.lineTo(x + 18 + facing * 26, y + 12 + bob);
    ctx.lineTo(x + 18 + facing * 18, y + 14 + bob);
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.fillStyle = '#ff4';
    ctx.beginPath();
    ctx.arc(x + 21 + facing * 9, y + 8 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + 21 + facing * 9, y + 8 + bob, 1.2, 0, Math.PI * 2);
    ctx.fill();
    // Feet
    ctx.strokeStyle = '#e0a020';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 30 + bob);
    ctx.lineTo(x + 8, y + 38 + bob);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 22, y + 30 + bob);
    ctx.lineTo(x + 26, y + 38 + bob);
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
    drawTilePattern(ctx, x + 3, groundY - 120, 31, 32, 8);
  },
};
