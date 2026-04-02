import { useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { BIRD_X, BIRD_RADIUS, PIPE_WIDTH, PIPE_GAP, GROUND_HEIGHT } from '../flappy.slice';
import type { RootState } from '../hooks/useFlappyGame.types';

// ── Day/Night cycle ───────────────────────────────────────────────────────────
//  Full cycle = 80 s: 35 s day │ 5 s sunset │ 35 s night │ 5 s sunrise
const CYCLE_MS = 80_000;

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/** dayFraction: 1 = full day, 0 = full night */
function getDayFraction(nowMs: number): number {
  const t = (nowMs % CYCLE_MS) / CYCLE_MS;
  if (t < 0.4375) return 1;
  if (t < 0.5) return 1 - smoothstep((t - 0.4375) / 0.0625); // sunset
  if (t < 0.9375) return 0;
  return smoothstep((t - 0.9375) / 0.0625); // sunrise
}

// ── Color helpers ─────────────────────────────────────────────────────────────
type RGB = [number, number, number];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function css([r, g, b]: RGB, a = 1): string {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a.toFixed(3)})`;
}

// ── Sky palettes ──────────────────────────────────────────────────────────────
const C_DAY_TOP: RGB = [135, 206, 235];
const C_DAY_BOT: RGB = [201, 232, 245];
const C_DUSK_TOP: RGB = [30, 14, 68]; // deep violet
const C_DUSK_BOT: RGB = [255, 105, 38]; // warm orange
const C_NIGHT_TOP: RGB = [5, 8, 25];
const C_NIGHT_BOT: RGB = [12, 28, 72];

function getSkyColors(df: number): { top: RGB; bot: RGB } {
  if (df >= 0.5) {
    const t = (1 - df) * 2; // 0 at full day → 1 at dusk
    return { top: lerpRGB(C_DAY_TOP, C_DUSK_TOP, t), bot: lerpRGB(C_DAY_BOT, C_DUSK_BOT, t) };
  }
  const t = df * 2; // 0 at full night → 1 at dusk
  return { top: lerpRGB(C_NIGHT_TOP, C_DUSK_TOP, t), bot: lerpRGB(C_NIGHT_BOT, C_DUSK_BOT, t) };
}

// ── Static cosmetic objects ───────────────────────────────────────────────────
interface Cloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
}
const clouds: Cloud[] = Array.from({ length: 5 }, (_, i) => ({
  x: 80 + i * 180,
  y: 40 + Math.random() * 80,
  scale: 0.6 + Math.random() * 0.8,
  speed: 0.3 + Math.random() * 0.3,
}));

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
}
const STARS: Star[] = Array.from({ length: 80 }, () => ({
  x: Math.random(),
  y: Math.random() * 0.72,
  size: 0.4 + Math.random() * 1.4,
  phase: Math.random() * Math.PI * 2,
}));

// ── Particle system ───────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

// ── Drawing helpers ───────────────────────────────────────────────────────────

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  df: number,
  time: number,
) {
  const { top, bot } = getSkyColors(df);
  const groundY = h - GROUND_HEIGHT;

  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, groundY);
  sky.addColorStop(0, css(top));
  sky.addColorStop(1, css(bot));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, groundY);

  // ── Stars (fade in below dayFraction = 0.5) ───────────────────────────────
  const starsAlpha = Math.max(0, 1 - df * 2.2);
  if (starsAlpha > 0.01) {
    for (const s of STARS) {
      const twinkle = 0.65 + 0.35 * Math.sin(time * 2.2 + s.phase);
      ctx.globalAlpha = starsAlpha * twinkle;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * groundY, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── Moon (visible in night half) ──────────────────────────────────────────
  const moonAlpha = Math.max(0, 1 - df * 2.5);
  if (moonAlpha > 0.01) {
    const moonX = w * 0.22;
    const moonY = groundY * 0.12 + df * groundY * 0.55;
    ctx.globalAlpha = moonAlpha;
    // Soft glow halo
    const glow = ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, 50);
    glow.addColorStop(0, 'rgba(200,215,255,0.25)');
    glow.addColorStop(1, 'rgba(200,215,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
    ctx.fill();
    // Moon disc
    ctx.fillStyle = '#dde0f0';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 18, 0, Math.PI * 2);
    ctx.fill();
    // Crescent shadow (same as sky top so it looks carved out)
    ctx.globalAlpha = moonAlpha * 0.85;
    ctx.fillStyle = css(lerpRGB(C_NIGHT_TOP, C_DUSK_TOP, df * 2), 1);
    ctx.beginPath();
    ctx.arc(moonX + 7, moonY - 3, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── Sun (visible in day half, rises/sets smoothly) ────────────────────────
  const sunAlpha = Math.min(1, df * 2.5);
  if (sunAlpha > 0.01) {
    // Y: near horizon (groundY * 0.92) when df≈0.5, high up (groundY * 0.1) when df=1
    const sunX = w * 0.76;
    const sunY = groundY * (0.92 - df * 0.82);
    ctx.globalAlpha = sunAlpha;
    // Warm outer glow (more orange near horizon)
    const glowColor = df > 0.75 ? 'rgba(255,252,120,0.18)' : 'rgba(255,120,30,0.28)';
    const outerGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 90);
    outerGlow.addColorStop(0, glowColor);
    outerGlow.addColorStop(1, 'rgba(255,200,50,0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
    ctx.fill();
    // Sun disc (yellower high up, more orange at horizon)
    const discColor = css(lerpRGB([255, 128, 20], [255, 252, 100], df));
    ctx.fillStyle = discColor;
    ctx.beginPath();
    ctx.arc(sunX, sunY, df > 0.75 ? 22 : 27, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── Horizon glow at dusk / dawn ───────────────────────────────────────────
  const twilight = 1 - Math.abs(df * 2 - 1); // peaks at df=0.5
  if (twilight > 0.04) {
    const glow = ctx.createLinearGradient(0, groundY - 100, 0, groundY);
    glow.addColorStop(0, `rgba(255,90,20,0)`);
    glow.addColorStop(1, `rgba(255,115,38,${(twilight * 0.55).toFixed(3)})`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, groundY - 100, w, 100);
  }
}

function drawClouds(ctx: CanvasRenderingContext2D, w: number, df: number) {
  for (const c of clouds) {
    c.x -= c.speed;
    if (c.x + 120 * c.scale < 0) c.x = w + 120 * c.scale;
    drawCloud(ctx, c.x, c.y, c.scale, df);
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, df: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // White in day → dark blue-grey at night
  const col = lerpRGB([45, 55, 88], [255, 255, 255], df);
  const alpha = 0.28 + df * 0.57;
  ctx.fillStyle = css(col, alpha);
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.arc(35, -10, 22, 0, Math.PI * 2);
  ctx.arc(-30, 5, 20, 0, Math.PI * 2);
  ctx.arc(10, -20, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGround(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frameCount: number,
  df: number,
) {
  const groundY = h - GROUND_HEIGHT;

  // Dirt — darker at night
  const dirtTop = lerpRGB([28, 20, 6], [130, 90, 20], df);
  const dirtBot = lerpRGB([18, 12, 4], [105, 68, 12], df);
  const dirt = ctx.createLinearGradient(0, groundY, 0, h);
  dirt.addColorStop(0, css(dirtTop));
  dirt.addColorStop(1, css(dirtBot));
  ctx.fillStyle = dirt;
  ctx.fillRect(0, groundY, w, GROUND_HEIGHT);

  // Grass strip
  ctx.fillStyle = css(lerpRGB([22, 50, 22], [92, 184, 92], df));
  ctx.fillRect(0, groundY, w, 14);

  // Grass blades
  ctx.fillStyle = css(lerpRGB([14, 35, 14], [40, 118, 40], df));
  const offset = (frameCount * 2) % 24;
  for (let x = -offset; x < w; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, groundY + 14);
    ctx.lineTo(x + 4, groundY + 2);
    ctx.lineTo(x + 8, groundY + 14);
    ctx.fill();
  }
}

function drawPipe(
  ctx: CanvasRenderingContext2D,
  pipeX: number,
  gapY: number,
  canvasHeight: number,
  df: number,
) {
  const gapTop = gapY - PIPE_GAP / 2;
  const gapBottom = gapY + PIPE_GAP / 2;
  const groundY = canvasHeight - GROUND_HEIGHT;
  const capH = 22;
  const capOverhang = 6;

  const pipeGreen = css(lerpRGB([18, 58, 14], [58, 157, 35], df));
  const pipeDark = css(lerpRGB([10, 38, 8], [42, 115, 24], df));
  const pipeLight = css(lerpRGB([32, 85, 22], [92, 197, 66], df));

  ctx.save();

  const makeGrad = () => {
    const g = ctx.createLinearGradient(pipeX, 0, pipeX + PIPE_WIDTH, 0);
    g.addColorStop(0, pipeDark);
    g.addColorStop(0.3, pipeGreen);
    g.addColorStop(0.7, pipeLight);
    g.addColorStop(1, pipeDark);
    return g;
  };

  ctx.fillStyle = makeGrad();
  ctx.fillRect(pipeX, 0, PIPE_WIDTH, gapTop - capH);
  ctx.fillStyle = pipeGreen;
  ctx.fillRect(pipeX - capOverhang, gapTop - capH, PIPE_WIDTH + capOverhang * 2, capH);
  ctx.fillStyle = pipeDark;
  ctx.fillRect(pipeX - capOverhang, gapTop - capH, 6, capH);
  ctx.fillRect(pipeX + PIPE_WIDTH + capOverhang - 6, gapTop - capH, 6, capH);

  ctx.fillStyle = makeGrad();
  ctx.fillRect(pipeX, gapBottom + capH, PIPE_WIDTH, groundY - gapBottom - capH);
  ctx.fillStyle = pipeGreen;
  ctx.fillRect(pipeX - capOverhang, gapBottom, PIPE_WIDTH + capOverhang * 2, capH);
  ctx.fillStyle = pipeDark;
  ctx.fillRect(pipeX - capOverhang, gapBottom, 6, capH);
  ctx.fillRect(pipeX + PIPE_WIDTH + capOverhang - 6, gapBottom, 6, capH);

  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(pipeX + PIPE_WIDTH - 10, 0, 10, gapTop - capH);
  ctx.fillRect(pipeX + PIPE_WIDTH - 10, gapBottom + capH, 10, groundY - gapBottom - capH);

  ctx.restore();
}

function drawBird(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  vy: number,
  status: string,
  time: number,
) {
  const isDead = status === 'dead';
  const angle = isDead ? Math.PI / 2 : Math.max(-0.4, Math.min(Math.PI / 3, vy * 0.05));
  const wingAngle = isDead ? 0.3 : 0.3 + Math.sin(time * 8) * 0.25;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Wing
  ctx.save();
  ctx.rotate(-wingAngle);
  ctx.fillStyle = '#e8a800';
  ctx.beginPath();
  ctx.ellipse(-4, 2, 10, 7, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Body
  ctx.fillStyle = isDead ? '#e05555' : '#f5c518';
  ctx.beginPath();
  ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Belly
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath();
  ctx.ellipse(2, 4, 9, 7, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(7, -5, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(isDead ? 7 : 8, -5, 3, 0, Math.PI * 2);
  ctx.fill();

  if (isDead) {
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, -8);
    ctx.lineTo(10, -2);
    ctx.moveTo(10, -8);
    ctx.lineTo(4, -2);
    ctx.stroke();
  }

  // Beak
  ctx.fillStyle = '#ff8c00';
  ctx.beginPath();
  ctx.moveTo(12, -3);
  ctx.lineTo(20, 0);
  ctx.lineTo(12, 3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawScore(ctx: CanvasRenderingContext2D, score: number, w: number) {
  ctx.save();
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 4;
  ctx.strokeText(String(score), w / 2, 60);
  ctx.fillText(String(score), w / 2, 60);
  ctx.restore();
}

function spawnDeathParticles(x: number, y: number): Particle[] {
  const colors = ['#f5c518', '#e8a800', '#fff3b0', '#fff'];
  return Array.from({ length: 20 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.4;
    const speed = 2 + Math.random() * 4;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 3,
    };
  });
}

function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.15, life: p.life - 0.025 }))
    .filter((p) => p.life > 0);
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FlappyBoardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const prevStatusRef = useRef<string>('idle');

  const birdY = useSelector((s: RootState) => s.flappy.birdY);
  const birdVY = useSelector((s: RootState) => s.flappy.birdVY);
  const pipes = useSelector((s: RootState) => s.flappy.pipes);
  const status = useSelector((s: RootState) => s.flappy.status);
  const score = useSelector((s: RootState) => s.flappy.score);
  const width = useSelector((s: RootState) => s.flappy.width);
  const height = useSelector((s: RootState) => s.flappy.height);
  const frameCount = useSelector((s: RootState) => s.flappy.frameCount);

  const stateRef = useRef({ birdY, birdVY, pipes, status, score, width, height, frameCount });
  stateRef.current = { birdY, birdVY, pipes, status, score, width, height, frameCount };

  useEffect(() => {
    if (status === 'dead' && prevStatusRef.current === 'running') {
      particlesRef.current = spawnDeathParticles(BIRD_X, birdY);
    }
    if (status === 'idle') particlesRef.current = [];
    prevStatusRef.current = status;
  }, [status, birdY]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { birdY, birdVY, pipes, status, score, width, height, frameCount } = stateRef.current;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const now = performance.now();
    const time = now / 1000;
    const df = getDayFraction(now);

    ctx.clearRect(0, 0, width, height);

    drawBackground(ctx, width, height, df, time);
    drawClouds(ctx, width, df);

    for (const pipe of pipes) drawPipe(ctx, pipe.x, pipe.gapY, height, df);

    drawGround(ctx, width, height, frameCount, df);
    drawBird(ctx, BIRD_X, birdY, birdVY, status, time);

    particlesRef.current = updateParticles(particlesRef.current);
    drawParticles(ctx, particlesRef.current);

    drawScore(ctx, score, width);

    animRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [render]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />;
}
