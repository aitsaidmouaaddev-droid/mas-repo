import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../hooks/usePlatformerGame.types';
import { getWorld } from '../worlds/world.registry';
import { getCharacter } from '../characters/character.registry';
import {
  GROUND_HEIGHT,
  PLAYER_W,
  PLAYER_H,
  ENEMY_W,
  ENEMY_H,
  BOX_W,
  BOX_H,
} from '../platform.slice';
import { startMusic, stopMusic } from '../music';

export function MoroccanBoardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useSelector((s: RootState) => s.platform);
  const worldIndex = state.worldIndex;

  // Start / stop background music when world changes or game mounts/unmounts
  useEffect(() => {
    if (state.status !== 'idle' && state.status !== 'character-select') {
      startMusic(worldIndex);
    }
    return () => stopMusic();
  }, [worldIndex, state.status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let rafId: number;
    let alive = true;

    function render(nowMs: number) {
      if (!alive || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width: w, height: h } = state;
      canvas.width = w;
      canvas.height = h;

      const world = getWorld(state.worldIndex);
      const character = state.characterId ? getCharacter(state.characterId) : null;
      const groundY = h - GROUND_HEIGHT;
      const cam = state.cameraX;

      // ── Background ───────────────────────────────────────────────────────
      world.drawBackground(ctx, state, nowMs);

      // ── Ground segments ──────────────────────────────────────────────────
      world.drawGround(ctx, state);

      // ── Elevated platforms ───────────────────────────────────────────────
      for (const p of state.platforms) {
        const sx = p.x - cam;
        if (sx + p.w < 0 || sx > w) continue;
        const sy = groundY - p.yFromGround - p.h;
        world.drawPlatform(ctx, sx, sy, p.w, p.h);
      }

      // ── Boxes ────────────────────────────────────────────────────────────
      for (const box of state.boxes) {
        const sx = box.x - cam;
        if (sx + BOX_W < 0 || sx > w) continue;
        // Box bottom is at groundY - box.yFromGround
        const by = groundY - box.yFromGround - BOX_H;
        const pop = box.hitFrames > 0 ? (box.hitFrames / 24) * 4 : 0;

        if (box.hit) {
          // Cracked / spent box
          ctx.fillStyle = '#888070';
          ctx.fillRect(sx, by - pop, BOX_W, BOX_H);
          ctx.strokeStyle = '#666050';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 1, by - pop + 1, BOX_W - 2, BOX_H - 2);
          // Crack lines
          ctx.strokeStyle = '#555040';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx + BOX_W / 2, by - pop + 4);
          ctx.lineTo(sx + BOX_W / 2 - 5, by - pop + BOX_H / 2);
          ctx.lineTo(sx + BOX_W / 2 + 4, by - pop + BOX_H - 4);
          ctx.stroke();
        } else {
          // Golden question-mark box
          const grad = ctx.createLinearGradient(sx, by - pop, sx, by - pop + BOX_H);
          grad.addColorStop(0, '#f8d060');
          grad.addColorStop(0.5, '#e8a820');
          grad.addColorStop(1, '#c07010');
          ctx.fillStyle = grad;
          ctx.fillRect(sx, by - pop, BOX_W, BOX_H);
          // Highlight top-left edge
          ctx.fillStyle = '#fff8c0';
          ctx.fillRect(sx, by - pop, BOX_W, 3);
          ctx.fillStyle = '#fff8c0';
          ctx.fillRect(sx, by - pop, 3, BOX_H);
          // Dark border
          ctx.strokeStyle = '#804800';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 1, by - pop + 1, BOX_W - 2, BOX_H - 2);
          // "?" symbol
          ctx.fillStyle = '#fff';
          ctx.font = `bold ${BOX_H * 0.55}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', sx + BOX_W / 2, by - pop + BOX_H / 2 + 1);
        }
      }

      // ── Coins ────────────────────────────────────────────────────────────
      for (const coin of state.coins) {
        if (coin.collected) continue;
        const sx = coin.x - cam;
        if (sx < -20 || sx > w + 20) continue;
        const sy = groundY - coin.yFromGround;
        world.drawCoin(ctx, sx, sy, nowMs);
      }

      // ── Enemies ──────────────────────────────────────────────────────────
      for (const enemy of state.enemies) {
        const sx = enemy.x - cam;
        if (sx + ENEMY_W < 0 || sx > w) continue;
        const sy = groundY - enemy.yFromGround - ENEMY_H;
        if (!enemy.alive) {
          if (enemy.stunnedFrames > 0) {
            ctx.save();
            ctx.globalAlpha = enemy.stunnedFrames / 20;
            world.drawEnemy(ctx, sx, sy + ENEMY_H * 0.6, enemy.vx, nowMs);
            ctx.restore();
          }
          continue;
        }
        world.drawEnemy(ctx, sx, sy, enemy.vx, nowMs);
      }

      // ── Flag ─────────────────────────────────────────────────────────────
      const flagSX = state.flagX - cam;
      if (flagSX > -40 && flagSX < w + 40) {
        world.drawFlag(ctx, flagSX, groundY);
      }

      // ── Player ───────────────────────────────────────────────────────────
      if (character && state.status !== 'idle' && state.status !== 'character-select') {
        const sx = state.playerX - cam;
        const blink =
          state.invincibleFrames > 0 && Math.floor(state.invincibleFrames / 6) % 2 === 0;
        if (!blink) {
          ctx.save();
          ctx.translate(sx - state.playerX, 0);
          character.draw(ctx, state, nowMs);
          ctx.restore();

          // Powered aura
          if (state.isPowered) {
            const auraAlpha =
              state.poweredFrames < 120
                ? Math.floor(state.poweredFrames / 8) % 2 === 0
                  ? 0.6
                  : 0.15
                : 0.35;
            ctx.save();
            ctx.globalAlpha = auraAlpha;
            ctx.strokeStyle = '#f0e040';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(
              sx + PLAYER_W / 2,
              state.playerY + PLAYER_H / 2,
              PLAYER_W / 2 + 4,
              PLAYER_H / 2 + 4,
              0,
              0,
              Math.PI * 2,
            );
            ctx.stroke();
            ctx.restore();
          }
        }
        // Shadow
        if (!blink) {
          ctx.save();
          ctx.globalAlpha = 0.18;
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.ellipse(sx + PLAYER_W / 2, groundY, PLAYER_W / 2, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // ── Level-complete flash ─────────────────────────────────────────────
      if (state.status === 'level-complete') {
        const alpha = 0.5 * (state.statusFrames % 20 < 10 ? 1 : 0.4);
        ctx.save();
        ctx.fillStyle = `rgba(255,240,100,${alpha})`;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      // ── Dead overlay ─────────────────────────────────────────────────────
      if (state.status === 'dead' || state.status === 'game-complete') {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    }

    rafId = requestAnimationFrame(render);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
     
  }, [state]);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
}
