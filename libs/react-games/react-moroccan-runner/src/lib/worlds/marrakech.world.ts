import type { WorldDescriptor } from './world.types';
import { GROUND_HEIGHT } from '../platform.slice';
import { getDayFraction, lerpRGB, starAlpha } from '../dayNight';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  skyTop: '#d4712c',
  skyBot: '#ffd07a',
  atlasFar: '#b05820',
  atlasNear: '#e08040',
  medinaWall: '#c9945c',
  medinaRoof: '#8b3a3a',
  archedDoor: '#6b2d2d',
  palmTrunk: '#8b6914',
  palmLeaf: '#2d5a1b',
  ground: '#c17d3c',
  groundLine: '#a0622a',
  cobble: '#b87040',
  platTop: '#e8a460',
  platMid: '#c8884a',
  platBot: '#8b5020',
  platDiamond: '#d4764e',
  coinOuter: '#f5c842',
  coinInner: '#fff07a',
  coinStar: '#e8a800',
  enemyBody: '#e05030',
  enemyEye: '#fff',
  enemyPupil: '#000',
  flagPole: '#7a5020',
  flagCloth: '#e83030',
};

function draw8Star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    if (i === 0) ctx.moveTo(cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad);
    else ctx.lineTo(cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad);
  }
  ctx.closePath();
}

function drawArch(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const archH = w * 0.65;
  ctx.fillRect(x, y + archH, w, h - archH);
  ctx.beginPath();
  ctx.arc(x + w / 2, y + archH, w / 2, Math.PI, 0);
  ctx.lineTo(x + w, y + archH);
  ctx.lineTo(x, y + archH);
  ctx.closePath();
  ctx.fill();
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, df: number) {
  const topDay = [212, 113, 44] as const;
  const topNight = [8, 10, 40] as const;
  const botDay = [255, 208, 122] as const;
  const botNight = [18, 24, 80] as const;
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
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#fff';
  // Deterministic pseudo-random stars using fixed seeds
  const seeds = [
    73, 197, 311, 419, 503, 617, 709, 811, 907, 1013, 1117, 1229, 1303, 1409, 1511, 1607, 1709,
    1801,
  ];
  for (let i = 0; i < 18; i++) {
    const sx = ((seeds[i] * 137 + 50) % (w - 20)) + 10;
    const sy = ((seeds[i] * 89 + 20) % (h * 0.5)) + 10;
    const twinkle = 0.5 + 0.5 * Math.sin(nowMs / 800 + i * 1.7);
    ctx.globalAlpha = alpha * twinkle;
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
  ctx.fillStyle = '#050a20';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawMountains(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
  const groundY = h - GROUND_HEIGHT;
  // Far layer
  ctx.fillStyle = C.atlasFar;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  const pts: [number, number][] = [
    [0, 0.55],
    [0.12, 0.36],
    [0.25, 0.46],
    [0.38, 0.32],
    [0.5, 0.5],
    [0.62, 0.38],
    [0.75, 0.44],
    [0.88, 0.34],
    [1, 0.55],
  ];
  for (const [px, py] of pts) {
    const sx = ((((px * w * 2 - camX * 0.1) % (w * 2)) + w * 2) % (w * 2)) - w / 2;
    ctx.lineTo(sx, groundY - py * groundY);
  }
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();
  // Near layer
  ctx.fillStyle = C.atlasNear;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  const pts2: [number, number][] = [
    [0, 0.34],
    [0.1, 0.2],
    [0.24, 0.3],
    [0.36, 0.17],
    [0.5, 0.32],
    [0.64, 0.22],
    [0.78, 0.28],
    [0.9, 0.19],
    [1, 0.34],
  ];
  for (const [px, py] of pts2) {
    const sx = ((((px * w * 2 - camX * 0.2) % (w * 2)) + w * 2) % (w * 2)) - w / 2;
    ctx.lineTo(sx, groundY - py * groundY);
  }
  ctx.lineTo(w, groundY);
  ctx.closePath();
  ctx.fill();
}

function drawMedina(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
  const groundY = h - GROUND_HEIGHT;
  const tileW = 220;
  const off = (camX * 0.55) % tileW;
  for (let tx = -off; tx < w + tileW; tx += tileW) {
    ctx.fillStyle = C.medinaWall;
    ctx.fillRect(tx, groundY - 130, 160, 130);
    ctx.fillStyle = C.medinaRoof;
    for (let bx = tx; bx < tx + 160; bx += 18) ctx.fillRect(bx, groundY - 142, 10, 14);
    ctx.fillStyle = C.archedDoor;
    drawArch(ctx, tx + 16, groundY - 105, 26, 48);
    drawArch(ctx, tx + 64, groundY - 105, 26, 48);
    drawArch(ctx, tx + 112, groundY - 105, 26, 48);
    // Minaret
    ctx.fillStyle = C.medinaWall;
    ctx.fillRect(tx + 164, groundY - 190, 28, 190);
    ctx.fillStyle = C.medinaRoof;
    ctx.beginPath();
    ctx.moveTo(tx + 164, groundY - 190);
    ctx.lineTo(tx + 178, groundY - 216);
    ctx.lineTo(tx + 192, groundY - 190);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPalms(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
  const groundY = h - GROUND_HEIGHT;
  const sp = 200;
  const off = (camX * 0.75) % sp;
  for (let px = -off; px < w + sp; px += sp) {
    const trunkH = 70 + Math.sin(px * 0.12) * 12;
    ctx.fillStyle = C.palmTrunk;
    ctx.fillRect(px + 4, groundY - trunkH, 7, trunkH);
    ctx.strokeStyle = C.palmLeaf;
    ctx.lineWidth = 2.5;
    for (const deg of [-65, -35, 0, 35, 65, 110, 145]) {
      const r = (deg * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(px + 7, groundY - trunkH);
      ctx.lineTo(px + 7 + Math.cos(r) * 38, groundY - trunkH + Math.sin(r) * 38);
      ctx.stroke();
    }
  }
}

export const MARRAKECH_WORLD: WorldDescriptor = {
  id: 'marrakech',
  name: 'Marrakech',
  groundColor: C.ground,
  groundHeight: GROUND_HEIGHT,

  drawBackground(ctx, state, nowMs) {
    const { width: w, height: h, cameraX } = state;
    const df = getDayFraction(nowMs);
    drawSky(ctx, w, h, df);
    drawStars(ctx, w, h, df, nowMs);
    drawMountains(ctx, w, h, cameraX);
    drawMedina(ctx, w, h, cameraX);
    drawPalms(ctx, w, h, cameraX);
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
      grad.addColorStop(1, '#8b5a1a');
      ctx.fillStyle = grad;
      ctx.fillRect(sx1, groundY, sx2 - sx1, GROUND_HEIGHT);
      // Cobble
      const step = 48;
      const tileOff = (((cameraX - x1) % step) + step) % step;
      ctx.strokeStyle = C.groundLine;
      ctx.lineWidth = 1;
      for (let cx = sx1 - tileOff; cx < sx2; cx += step) {
        ctx.strokeRect(
          Math.max(cx, sx1),
          groundY + 4,
          Math.min(step - 2, sx2 - Math.max(cx, sx1) - 1),
          18,
        );
      }
      ctx.fillStyle = '#9a5c20';
      ctx.fillRect(sx1, groundY, sx2 - sx1, 3);
      ctx.fillStyle = '#f0c060';
      ctx.fillRect(sx1, groundY + 1, sx2 - sx1, 1);
    }
  },

  drawPlatform(ctx, x, y, w, h) {
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, C.platTop);
    grad.addColorStop(1, C.platMid);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    // Zellige diamonds
    ctx.fillStyle = C.platDiamond;
    for (let dx = 14; dx < w - 8; dx += 16) {
      ctx.save();
      ctx.translate(x + dx, y + h / 2);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-3.5, -3.5, 7, 7);
      ctx.restore();
    }
    ctx.fillStyle = '#f0c080';
    ctx.fillRect(x, y, w, 2);
    ctx.fillStyle = C.platBot;
    ctx.fillRect(x, y + h - 2, w, 2);
  },

  drawCoin(ctx, x, y, nowMs) {
    const bounce = Math.sin(nowMs / 380 + x * 0.04) * 3;
    ctx.beginPath();
    ctx.arc(x, y + bounce, 10, 0, Math.PI * 2);
    ctx.fillStyle = C.coinOuter;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + bounce, 7, 0, Math.PI * 2);
    ctx.fillStyle = C.coinInner;
    ctx.fill();
    draw8Star(ctx, x, y + bounce, 5);
    ctx.fillStyle = C.coinStar;
    ctx.fill();
  },

  drawEnemy(ctx, x, y, vx, nowMs) {
    const legSwing = Math.sin(nowMs / 120) * 6;
    const facing = vx >= 0 ? 1 : -1;
    // Body — round market cat
    ctx.fillStyle = C.enemyBody;
    ctx.beginPath();
    ctx.ellipse(x + 18, y + 16, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = '#f06040';
    ctx.beginPath();
    ctx.ellipse(x + 18 + facing * 10, y + 6, 11, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = C.enemyEye;
    ctx.beginPath();
    ctx.ellipse(x + 22 + facing * 10, y + 4, 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.enemyPupil;
    ctx.beginPath();
    ctx.ellipse(x + 23 + facing * 10, y + 4, 2, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Ears
    ctx.fillStyle = '#f06040';
    ctx.beginPath();
    ctx.moveTo(x + 10 + facing * 10, y - 2);
    ctx.lineTo(x + 16 + facing * 10, y + 2);
    ctx.lineTo(x + 12 + facing * 10, y + 4);
    ctx.closePath();
    ctx.fill();
    // Tail
    ctx.strokeStyle = '#c04020';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + (vx >= 0 ? 2 : 34), y + 22);
    ctx.bezierCurveTo(x - facing * 14, y + 10, x - facing * 10, y - 8, x + 18 - facing * 10, y - 5);
    ctx.stroke();
    // Legs
    ctx.fillStyle = '#c04020';
    ctx.fillRect(x + 8, y + 26, 7, 12 + legSwing / 2);
    ctx.fillRect(x + 21, y + 26, 7, 12 - legSwing / 2);
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
    draw8Star(ctx, x + 16, groundY - 106, 6);
    ctx.fill();
  },
};
