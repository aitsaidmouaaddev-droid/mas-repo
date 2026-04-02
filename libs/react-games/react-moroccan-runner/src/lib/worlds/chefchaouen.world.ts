import type { WorldDescriptor } from './world.types';
import type { PlatformerState } from '../platform.slice';
import { GROUND_HEIGHT } from '../platform.slice';
import { getDayFraction, lerpRGB, starAlpha } from '../dayNight';

// ── Palette — blue mountain city ─────────────────────────────────────────────
const C = {
  skyTop: '#b8d8f8',
  skyBot: '#e8f4ff',
  mtnFar: '#8098c0',
  mtnNear: '#6080b0',
  wallBlue: '#5090d8',
  wallLight: '#70b0f0',
  wallWhite: '#f0f8ff',
  wallShade: '#c0d8f0',
  door: '#2860b0',
  window: '#4080c8',
  flower: '#e05080',
  ground: '#a0b8d0',
  groundLine: '#7090b0',
  platTop: '#a0c8e8',
  platMid: '#70a8d0',
  platBot: '#4080b0',
  platStripe: '#90bce0',
  coinOuter: '#f0e040',
  coinInner: '#fff8b0',
  coinStar: '#c8b800',
  enemyBody: '#907050',
  enemyHorn: '#c0a060',
  enemyEye: '#1a0a00',
  flagPole: '#6070a0',
  flagCloth: '#2050a0',
};

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, df: number) {
  const topDay = [184, 216, 248] as const;
  const topNight = [14, 20, 50] as const;
  const botDay = [232, 244, 255] as const;
  const botNight = [24, 34, 80] as const;
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
  ctx.fillStyle = '#eef4ff';
  const seeds = [
    61, 181, 307, 431, 521, 613, 719, 827, 911, 1021, 1129, 1237, 1319, 1427, 1523, 1609, 1721,
    1811,
  ];
  for (let i = 0; i < 18; i++) {
    const sx = ((seeds[i] * 137 + 50) % (w - 20)) + 10;
    const sy = ((seeds[i] * 89 + 20) % (h * 0.5)) + 10;
    ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.sin(nowMs / 850 + i * 2.1));
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
  ctx.fillStyle = '#080c28';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawMountains(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
  const groundY = h - GROUND_HEIGHT;
  ctx.fillStyle = C.mtnFar;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  const far: [number, number][] = [
    [0, 0.6],
    [0.08, 0.38],
    [0.18, 0.52],
    [0.3, 0.32],
    [0.44, 0.58],
    [0.58, 0.35],
    [0.7, 0.5],
    [0.84, 0.3],
    [1, 0.6],
  ];
  for (const [px, py] of far) {
    const sx = ((((px * w * 2 - camX * 0.1) % (w * 2)) + w * 2) % (w * 2)) - w / 2;
    ctx.lineTo(sx, groundY - py * groundY);
  }
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = C.mtnNear;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  const near: [number, number][] = [
    [0, 0.4],
    [0.1, 0.22],
    [0.24, 0.36],
    [0.38, 0.18],
    [0.52, 0.38],
    [0.66, 0.2],
    [0.8, 0.32],
    [0.92, 0.16],
    [1, 0.4],
  ];
  for (const [px, py] of near) {
    const sx = ((((px * w * 2 - camX * 0.22) % (w * 2)) + w * 2) % (w * 2)) - w / 2;
    ctx.lineTo(sx, groundY - py * groundY);
  }
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();
}

function drawBlueCity(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
  const groundY = h - GROUND_HEIGHT;
  const tileW = 180;
  const off = (camX * 0.55) % tileW;
  for (let tx = -off; tx < w + tileW; tx += tileW) {
    // Blue washed house
    ctx.fillStyle = C.wallBlue;
    ctx.fillRect(tx, groundY - 120, 140, 120);
    // White lower half (typical Chefchaouen two-tone)
    ctx.fillStyle = C.wallWhite;
    ctx.fillRect(tx, groundY - 55, 140, 55);
    // Stairs motif
    ctx.fillStyle = C.wallShade;
    for (let s = 0; s < 3; s++) ctx.fillRect(tx + s * 14, groundY - 18 - s * 14, 14, 14 + s * 14);
    // Door
    ctx.fillStyle = C.door;
    ctx.fillRect(tx + 52, groundY - 52, 36, 52);
    ctx.beginPath();
    ctx.arc(tx + 70, groundY - 52, 18, Math.PI, 0);
    ctx.lineTo(tx + 88, groundY - 52);
    ctx.lineTo(tx + 52, groundY - 52);
    ctx.closePath();
    ctx.fillStyle = C.door;
    ctx.fill();
    // Windows
    ctx.fillStyle = C.window;
    ctx.fillRect(tx + 12, groundY - 95, 22, 28);
    ctx.fillRect(tx + 106, groundY - 95, 22, 28);
    // Flower pots on windowsills
    ctx.fillStyle = C.flower;
    ctx.beginPath();
    ctx.arc(tx + 20, groundY - 70, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(tx + 114, groundY - 70, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

export const CHEFCHAOUEN_WORLD: WorldDescriptor = {
  id: 'chefchaouen',
  name: 'Chefchaouen',
  groundColor: C.ground,
  groundHeight: GROUND_HEIGHT,

  drawBackground(ctx, state: PlatformerState, nowMs) {
    const { width: w, height: h, cameraX } = state;
    const df = getDayFraction(nowMs);
    drawSky(ctx, w, h, df);
    drawStars(ctx, w, h, df, nowMs);
    drawMountains(ctx, w, h, cameraX);
    drawBlueCity(ctx, w, h, cameraX);
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
      grad.addColorStop(1, '#5070a0');
      ctx.fillStyle = grad;
      ctx.fillRect(sx1, groundY, sx2 - sx1, GROUND_HEIGHT);
      // Blue cobbles
      const step = 44;
      const tOff = (((cameraX - x1) % step) + step) % step;
      ctx.strokeStyle = C.groundLine;
      ctx.lineWidth = 1;
      for (let cx = sx1 - tOff; cx < sx2; cx += step) {
        ctx.strokeRect(
          Math.max(cx, sx1),
          groundY + 4,
          Math.min(step - 2, sx2 - Math.max(cx, sx1) - 1),
          20,
        );
      }
      ctx.fillStyle = C.wallBlue;
      ctx.fillRect(sx1, groundY, sx2 - sx1, 3);
      ctx.fillStyle = C.wallLight;
      ctx.fillRect(sx1, groundY + 1, sx2 - sx1, 1);
    }
  },

  drawPlatform(ctx, x, y, w, h) {
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, C.platTop);
    grad.addColorStop(1, C.platMid);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    // Stripe
    ctx.fillStyle = C.platStripe;
    for (let dx = 6; dx < w - 2; dx += 12) ctx.fillRect(x + dx, y + 3, 6, h - 6);
    ctx.fillStyle = C.wallLight;
    ctx.fillRect(x, y, w, 2);
    ctx.fillStyle = C.platBot;
    ctx.fillRect(x, y + h - 2, w, 2);
  },

  drawCoin(ctx, x, y, nowMs) {
    const bounce = Math.sin(nowMs / 380 + x * 0.05) * 3;
    ctx.beginPath();
    ctx.arc(x, y + bounce, 10, 0, Math.PI * 2);
    ctx.fillStyle = C.coinOuter;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + bounce, 7, 0, Math.PI * 2);
    ctx.fillStyle = C.coinInner;
    ctx.fill();
    // Star of David (6-pointed) for variety
    ctx.fillStyle = C.coinStar;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 5, y + bounce + Math.sin(a) * 5);
      ctx.lineTo(x + Math.cos(a + Math.PI / 3) * 2.5, y + bounce + Math.sin(a + Math.PI / 3) * 2.5);
      ctx.lineTo(
        x + Math.cos(a + (2 * Math.PI) / 3) * 5,
        y + bounce + Math.sin(a + (2 * Math.PI) / 3) * 5,
      );
      ctx.closePath();
      ctx.fill();
    }
  },

  drawEnemy(ctx, x, y, vx, nowMs) {
    // Mountain goat
    const legSwing = Math.sin(nowMs / 130) * 7;
    const facing = vx >= 0 ? 1 : -1;
    // Body
    ctx.fillStyle = C.enemyBody;
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 22, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.beginPath();
    ctx.ellipse(x + 18 + facing * 13, y + 12, 11, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Horn
    ctx.fillStyle = C.enemyHorn;
    ctx.beginPath();
    ctx.moveTo(x + 14 + facing * 13, y + 4);
    ctx.lineTo(x + 10 + facing * 13, y - 10);
    ctx.lineTo(x + 16 + facing * 13, y + 2);
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.fillStyle = C.enemyEye;
    ctx.beginPath();
    ctx.arc(x + 22 + facing * 11, y + 10, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Beard
    ctx.strokeStyle = '#c0a060';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 18 + facing * 18, y + 16);
    ctx.lineTo(x + 18 + facing * 22, y + 22);
    ctx.stroke();
    // Legs
    ctx.fillStyle = C.enemyBody;
    ctx.fillRect(x + 8, y + 32, 6, 10 + legSwing / 2);
    ctx.fillRect(x + 16, y + 32, 6, 10 - legSwing / 2);
    ctx.fillRect(x + 24, y + 32, 6, 10 + legSwing / 2);
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
    // White star
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + 16, groundY - 106, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.flagCloth;
    ctx.beginPath();
    ctx.arc(x + 18, groundY - 106, 6, 0, Math.PI * 2);
    ctx.fill();
  },
};
