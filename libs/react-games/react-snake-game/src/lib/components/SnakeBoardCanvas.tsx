import { useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { CELL_SIZE, type Cell, type Direction, type SpecialFood } from '../snake.slice';
import type { RootState } from '../hooks/useSnakeGame.types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0‥1, decays each frame
  color: string;
  size: number;
}

interface PrevState {
  snake: Cell[];
  food: Cell;
  specialFood: SpecialFood | null;
  direction: Direction;
  status: string;
  score: number;
  /** timestamp of last redux tick (for interpolation) */
  tickTime: number;
}

/* ------------------------------------------------------------------ */
/*  Color helpers                                                      */
/* ------------------------------------------------------------------ */

const SNAKE_HEAD = '#22d3ee'; // cyan-400
const SNAKE_BODY = '#06b6d4'; // cyan-500
const SNAKE_TAIL = '#0891b2'; // cyan-600
const FOOD_RED = '#ef4444';
const FOOD_STEM = '#65a30d'; // lime-600
const SPECIAL_GREEN = '#22c55e';
const SPECIAL_YELLOW = '#eab308';
const GRID_LINE = 'rgba(255,255,255,0.03)';
const DEAD_TINT = 'rgba(239,68,68,0.12)';

function lerpColor(a: string, b: string, t: number): string {
  const pa = parseHex(a),
    pb = parseHex(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `rgb(${r},${g},${bl})`;
}

function parseHex(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/* ------------------------------------------------------------------ */
/*  Segment direction helpers                                          */
/* ------------------------------------------------------------------ */

type SegDir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

function segmentDir(from: Cell, to: Cell): SegDir {
  if (to.x > from.x) return 'RIGHT';
  if (to.x < from.x) return 'LEFT';
  if (to.y > from.y) return 'DOWN';
  return 'UP';
}

function dirAngle(dir: SegDir): number {
  switch (dir) {
    case 'RIGHT':
      return 0;
    case 'DOWN':
      return Math.PI / 2;
    case 'LEFT':
      return Math.PI;
    case 'UP':
      return -Math.PI / 2;
  }
}

/* ------------------------------------------------------------------ */
/*  Drawing functions                                                  */
/* ------------------------------------------------------------------ */

const CS = CELL_SIZE;
const HALF = CS / 2;

function drawGrid(ctx: CanvasRenderingContext2D, cols: number, rows: number) {
  ctx.strokeStyle = GRID_LINE;
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CS, 0);
    ctx.lineTo(x * CS, rows * CS);
    ctx.stroke();
  }
  for (let y = 0; y <= rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CS);
    ctx.lineTo(cols * CS, y * CS);
    ctx.stroke();
  }
}

function drawSnakeSegment(
  ctx: CanvasRenderingContext2D,
  cell: Cell,
  index: number,
  total: number,
  snake: Cell[],
  direction: Direction,
) {
  const cx = cell.x * CS + HALF;
  const cy = cell.y * CS + HALF;
  const t = total > 1 ? index / (total - 1) : 0; // 0=head, 1=tail

  if (index === 0) {
    // ── HEAD ──
    const dir = direction;
    const angle = dirAngle(dir);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Head shape — rounded rectangle pointing right
    const hw = HALF * 0.9;
    const hh = HALF * 0.8;
    ctx.fillStyle = SNAKE_HEAD;
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, hw * 2, hh * 2, [hh * 0.4, hh * 0.8, hh * 0.8, hh * 0.4]);
    ctx.fill();

    // Eyes
    const eyeOffX = hw * 0.35;
    const eyeOffY = hh * 0.45;
    const eyeR = hh * 0.22;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(eyeOffX, -eyeOffY, eyeR, 0, Math.PI * 2);
    ctx.arc(eyeOffX, eyeOffY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    // Pupils
    ctx.fillStyle = '#1e293b';
    const pupilR = eyeR * 0.55;
    ctx.beginPath();
    ctx.arc(eyeOffX + pupilR * 0.3, -eyeOffY, pupilR, 0, Math.PI * 2);
    ctx.arc(eyeOffX + pupilR * 0.3, eyeOffY, pupilR, 0, Math.PI * 2);
    ctx.fill();

    // Tongue (flickers via time)
    const tonguePhase = (Date.now() % 600) / 600;
    if (tonguePhase < 0.5) {
      const tongueLen = hw * 0.6 + tonguePhase * hw * 0.4;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(hw, 0);
      ctx.lineTo(hw + tongueLen, 0);
      // Fork
      ctx.moveTo(hw + tongueLen * 0.7, 0);
      ctx.lineTo(hw + tongueLen, -2.5);
      ctx.moveTo(hw + tongueLen * 0.7, 0);
      ctx.lineTo(hw + tongueLen, 2.5);
      ctx.stroke();
    }

    ctx.restore();
  } else if (index === total - 1 && total > 2) {
    // ── TAIL ── tapered
    const prev = snake[index - 1];
    const dir = segmentDir(cell, prev);
    const angle = dirAngle(dir);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const tw = HALF * 0.85;
    const th = HALF * 0.3;
    ctx.fillStyle = lerpColor(SNAKE_BODY, SNAKE_TAIL, 1);
    ctx.beginPath();
    ctx.moveTo(-tw, -th);
    ctx.quadraticCurveTo(tw * 0.5, -th * 1.2, tw, 0);
    ctx.quadraticCurveTo(tw * 0.5, th * 1.2, -tw, th);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  } else {
    // ── BODY SEGMENT ──
    const color = lerpColor(SNAKE_HEAD, SNAKE_TAIL, t);
    const radius = HALF * (0.78 - t * 0.15);

    // Check for turns
    const prev = index > 0 ? snake[index - 1] : null;
    const next = index < total - 1 ? snake[index + 1] : null;

    if (prev && next) {
      const dx1 = prev.x - cell.x;
      const dy1 = prev.y - cell.y;
      const dx2 = next.x - cell.x;
      const dy2 = next.y - cell.y;
      const isTurn = dx1 !== dx2 && dy1 !== dy2;

      if (isTurn) {
        // Draw a rounded corner
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Fill toward prev
        ctx.fillRect(
          cx + Math.min(0, dx1) * radius - (dx1 === 0 ? radius : 0),
          cy + Math.min(0, dy1) * radius - (dy1 === 0 ? radius : 0),
          dx1 === 0 ? radius * 2 : Math.abs(dx1) * radius,
          dy1 === 0 ? radius * 2 : Math.abs(dy1) * radius,
        );
        // Fill toward next
        ctx.fillRect(
          cx + Math.min(0, dx2) * radius - (dx2 === 0 ? radius : 0),
          cy + Math.min(0, dy2) * radius - (dy2 === 0 ? radius : 0),
          dx2 === 0 ? radius * 2 : Math.abs(dx2) * radius,
          dy2 === 0 ? radius * 2 : Math.abs(dy2) * radius,
        );
        return;
      }
    }

    // Straight segment
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(cx - radius, cy - radius, radius * 2, radius * 2, radius * 0.4);
    ctx.fill();
  }
}

function drawApple(ctx: CanvasRenderingContext2D, cell: Cell, time: number) {
  const cx = cell.x * CS + HALF;
  const cy = cell.y * CS + HALF;

  // Subtle bounce
  const bounce = Math.sin(time * 3) * 1.2;
  const r = HALF * 0.6;

  ctx.save();
  ctx.translate(cx, cy + bounce);

  // Apple body — two overlapping circles for shape
  ctx.fillStyle = FOOD_RED;
  ctx.beginPath();
  ctx.arc(-r * 0.2, r * 0.05, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.2, r * 0.05, r, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.arc(-r * 0.25, -r * 0.3, r * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Stem
  ctx.strokeStyle = FOOD_STEM;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.7);
  ctx.quadraticCurveTo(r * 0.3, -r * 1.3, r * 0.1, -r * 1.4);
  ctx.stroke();

  // Leaf
  ctx.fillStyle = FOOD_STEM;
  ctx.beginPath();
  ctx.ellipse(r * 0.35, -r * 1.1, r * 0.35, r * 0.15, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSpecialFood(ctx: CanvasRenderingContext2D, sf: SpecialFood, time: number) {
  const cx = sf.x * CS + HALF;
  const cy = sf.y * CS + HALF;
  const baseColor = sf.type === 'green' ? SPECIAL_GREEN : SPECIAL_YELLOW;
  const r = HALF * 0.55;

  // Glow
  const glowPulse = 0.5 + Math.sin(time * 4) * 0.3;
  ctx.save();
  ctx.shadowColor = baseColor;
  ctx.shadowBlur = 12 * glowPulse;

  if (sf.type === 'green') {
    // Star shape
    drawStar(ctx, cx, cy, r, 5, baseColor, time);
  } else {
    // Diamond shape
    drawDiamond(ctx, cx, cy, r, baseColor, time);
  }

  ctx.restore();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  points: number,
  color: string,
  time: number,
) {
  const rot = time * 0.8;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2 + rot;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = cx + Math.cos(angle) * rad;
    const py = cy + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Inner highlight
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.arc(cx - r * 0.15, cy - r * 0.15, r * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  time: number,
) {
  const rot = time * 0.6;
  const cos = Math.cos(rot) * 0.15;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 1.2);
  ctx.lineTo(cx + r * (0.8 + cos), cy);
  ctx.lineTo(cx, cy + r * 1.2);
  ctx.lineTo(cx - r * (0.8 + cos), cy);
  ctx.closePath();
  ctx.fill();

  // Facet lines
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy - r * 0.3);
  ctx.lineTo(cx + r * 0.4, cy - r * 0.3);
  ctx.lineTo(cx + r * (0.8 + cos), cy);
  ctx.moveTo(cx - r * 0.4, cy - r * 0.3);
  ctx.lineTo(cx - r * (0.8 + cos), cy);
  ctx.stroke();
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

/* ------------------------------------------------------------------ */
/*  Particle spawners                                                  */
/* ------------------------------------------------------------------ */

function spawnEatParticles(cell: Cell, color: string): Particle[] {
  const cx = cell.x * CS + HALF;
  const cy = cell.y * CS + HALF;
  const particles: Particle[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
    const speed = 1 + Math.random() * 2.5;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color,
      size: 2 + Math.random() * 2,
    });
  }
  return particles;
}

function spawnDeathParticles(snake: Cell[]): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < Math.min(snake.length, 30); i++) {
    const cell = snake[i];
    const cx = cell.x * CS + HALF;
    const cy = cell.y * CS + HALF;
    for (let j = 0; j < 3; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 3;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.6 + Math.random() * 0.4,
        color: lerpColor(SNAKE_HEAD, SNAKE_TAIL, i / snake.length),
        size: 2 + Math.random() * 2,
      });
    }
  }
  return particles;
}

function updateParticles(particles: Particle[], dt: number): Particle[] {
  const alive: Particle[] = [];
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // gravity
    p.life -= dt * 1.5;
    if (p.life > 0) alive.push(p);
  }
  return alive;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SnakeBoardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const prevRef = useRef<PrevState | null>(null);

  const snake = useSelector((s: RootState) => s.snake.snake);
  const food = useSelector((s: RootState) => s.snake.food);
  const specialFood = useSelector((s: RootState) => s.snake.specialFood);
  const direction = useSelector((s: RootState) => s.snake.direction);
  const status = useSelector((s: RootState) => s.snake.status);
  const score = useSelector((s: RootState) => s.snake.score);
  const boardCols = useSelector((s: RootState) => s.snake.boardCols);
  const boardRows = useSelector((s: RootState) => s.snake.boardRows);

  // Store latest state in refs for the animation loop
  const stateRef = useRef({
    snake,
    food,
    specialFood,
    direction,
    status,
    score,
    boardCols,
    boardRows,
  });
  stateRef.current = { snake, food, specialFood, direction, status, score, boardCols, boardRows };

  // Detect eat / death events for particles
  useEffect(() => {
    const prev = prevRef.current;
    if (!prev) {
      prevRef.current = {
        snake,
        food,
        specialFood,
        direction,
        status,
        score,
        tickTime: performance.now(),
      };
      return;
    }

    // Food eaten
    if (prev.food.x !== food.x || prev.food.y !== food.y) {
      particlesRef.current.push(...spawnEatParticles(prev.food, FOOD_RED));
    }

    // Special food eaten (was present, now null, and snake is longer)
    if (prev.specialFood && !specialFood && snake.length > prev.snake.length) {
      const color = prev.specialFood.type === 'green' ? SPECIAL_GREEN : SPECIAL_YELLOW;
      particlesRef.current.push(...spawnEatParticles(prev.specialFood, color));
    }

    // Death
    if (status === 'dead' && prev.status !== 'dead') {
      particlesRef.current.push(...spawnDeathParticles(snake));
    }

    // Reset particles on game reset
    if (status === 'idle' && prev.status === 'dead') {
      particlesRef.current = [];
    }

    prevRef.current = {
      snake,
      food,
      specialFood,
      direction,
      status,
      score,
      tickTime: performance.now(),
    };
  }, [snake, food, specialFood, direction, status, score]);

  // Main render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { snake, food, specialFood, direction, status, boardCols, boardRows } = stateRef.current;
    const w = boardCols * CS;
    const h = boardRows * CS;

    // Resize canvas if needed (handles DPR)
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const time = performance.now() / 1000;
    const dt = 1 / 60;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = status === 'dead' ? DEAD_TINT : 'transparent';
    if (status === 'dead') ctx.fillRect(0, 0, w, h);

    // Grid
    drawGrid(ctx, boardCols, boardRows);

    // Food
    drawApple(ctx, food, time);

    // Special food
    if (specialFood) {
      drawSpecialFood(ctx, specialFood, time);
    }

    // Snake (draw tail-to-head so head is on top)
    for (let i = snake.length - 1; i >= 0; i--) {
      drawSnakeSegment(ctx, snake[i], i, snake.length, snake, direction);
    }

    // Particles
    particlesRef.current = updateParticles(particlesRef.current, dt);
    drawParticles(ctx, particlesRef.current);

    animRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [render]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />;
}
