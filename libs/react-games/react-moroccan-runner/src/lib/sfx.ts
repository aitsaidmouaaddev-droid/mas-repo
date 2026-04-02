// ── Web Audio helpers ─────────────────────────────────────────────────────────

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  return _ctx;
}

export function resumeAudio(): void {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
}

function tone(
  freq: number,
  type: OscillatorType,
  startGain: number,
  endGain: number,
  durationMs: number,
  delayMs = 0,
): void {
  resumeAudio();
  const ctx = getCtx();
  const now = ctx.currentTime + delayMs / 1000;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(startGain, now);
  gain.gain.linearRampToValueAtTime(endGain, now + durationMs / 1000);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durationMs / 1000);
}

// ── Shared / neutral SFX ──────────────────────────────────────────────────────

export const sharedSfx = {
  /** Hit a box from below */
  boxHit() {
    tone(300, 'square', 0.4, 0.1, 60);
    tone(500, 'square', 0.3, 0, 80, 20);
    tone(800, 'sine', 0.5, 0, 100, 40);
  },

  /** Become powered (star chime) */
  powerUp() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', 0.4, 0, 120, i * 60));
  },

  /** Power wears off */
  powerDown() {
    [1047, 784, 659, 523].forEach((f, i) => tone(f, 'triangle', 0.3, 0, 100, i * 50));
  },

  /** Level complete fanfare */
  levelComplete() {
    const melody = [523, 659, 784, 1047, 784, 1047, 1319];
    melody.forEach((f, i) => tone(f, 'sine', 0.45, 0, 140, i * 80));
  },

  /** Game complete — longer fanfare */
  gameComplete() {
    const melody = [523, 659, 784, 880, 784, 880, 1047, 880, 1047, 1319, 1047, 1319, 1568];
    melody.forEach((f, i) => tone(f, 'sine', 0.5, 0, 160, i * 80));
  },
};

// ── Character SFX ─────────────────────────────────────────────────────────────

export const hassanSfx = {
  jump() {
    tone(330, 'triangle', 0.4, 0, 120);
    tone(440, 'triangle', 0.25, 0, 180, 40);
  },
  coin() {
    tone(660, 'sine', 0.35, 0, 80);
    tone(880, 'sine', 0.25, 0, 100, 50);
    tone(1100, 'sine', 0.15, 0, 120, 100);
  },
  killEnemy() {
    tone(440, 'triangle', 0.5, 0, 80);
    tone(660, 'triangle', 0.4, 0, 100, 50);
    tone(880, 'triangle', 0.3, 0, 120, 100);
  },
  loseLife() {
    tone(300, 'sawtooth', 0.45, 0.05, 160);
    tone(220, 'sawtooth', 0.4, 0, 240, 100);
    tone(165, 'sawtooth', 0.35, 0, 320, 200);
  },
  death() {
    tone(300, 'sawtooth', 0.5, 0.1, 200);
    tone(200, 'sawtooth', 0.4, 0, 300, 100);
    tone(150, 'square', 0.3, 0, 400, 200);
  },
};

export const fatimaSfx = {
  jump() {
    tone(523, 'sine', 0.35, 0, 100);
    tone(659, 'sine', 0.2, 0, 150, 40);
  },
  coin() {
    tone(784, 'sine', 0.4, 0, 70);
    tone(1047, 'sine', 0.3, 0, 90, 45);
    tone(1319, 'sine', 0.15, 0, 110, 90);
  },
  killEnemy() {
    tone(523, 'sine', 0.5, 0, 70);
    tone(784, 'sine', 0.4, 0, 90, 45);
    tone(1047, 'sine', 0.3, 0, 110, 90);
  },
  loseLife() {
    tone(392, 'triangle', 0.45, 0.05, 160);
    tone(294, 'triangle', 0.38, 0, 240, 100);
    tone(220, 'triangle', 0.3, 0, 320, 200);
  },
  death() {
    tone(392, 'triangle', 0.45, 0.05, 180);
    tone(262, 'triangle', 0.35, 0, 280, 100);
    tone(196, 'triangle', 0.25, 0, 380, 200);
  },
};
