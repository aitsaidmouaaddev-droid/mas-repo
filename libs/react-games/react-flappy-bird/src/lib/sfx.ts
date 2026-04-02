/**
 * Flappy Bird — Web Audio API sound effects. No external deps.
 */

type OscType = OscillatorType;

function tone(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  type: OscType,
  peak: number,
  freqEnd?: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime + startTime;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (freqEnd !== undefined)
    osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration * 0.9);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(peak, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  osc.connect(gain);
  gain.connect(dest);
  osc.start(t);
  osc.stop(t + duration + 0.01);
}

function noise(
  ctx: AudioContext,
  dest: AudioNode,
  startTime: number,
  duration: number,
  peak: number,
  filterFreq = 2000,
) {
  const length = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;

  const gain = ctx.createGain();
  const t = ctx.currentTime + startTime;
  gain.gain.setValueAtTime(peak, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  src.start(t);
}

function withCtx(fn: (ctx: AudioContext, master: GainNode) => number) {
  try {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
    const closeAfter = fn(ctx, master);
    setTimeout(() => ctx.close(), closeAfter + 300);
  } catch {
    // SSR / no AudioContext
  }
}

export const sfx = {
  /** Light wing-flap whoosh */
  flap: () =>
    withCtx((ctx, out) => {
      // Airy sweep upward
      tone(ctx, out, 180, 0, 0.12, 'sine', 0.14, 320);
      noise(ctx, out, 0, 0.08, 0.06, 1200);
      return 150;
    }),

  /** Coin-style score pickup */
  score: () =>
    withCtx((ctx, out) => {
      tone(ctx, out, 660, 0, 0.08, 'square', 0.1);
      tone(ctx, out, 880, 0.08, 0.1, 'square', 0.1);
      return 200;
    }),

  /** Thud — hit a pipe or ground */
  hit: () =>
    withCtx((ctx, out) => {
      noise(ctx, out, 0, 0.15, 0.25, 400);
      tone(ctx, out, 120, 0, 0.18, 'sawtooth', 0.2, 40);
      tone(ctx, out, 60, 0, 0.22, 'sine', 0.25, 30);
      return 300;
    }),

  /** New best score fanfare */
  newBest: () =>
    withCtx((ctx, out) => {
      const notes = [523, 659, 784, 1047];
      notes.forEach((f, i) => {
        tone(ctx, out, f, i * 0.08, 0.18, 'sine', 0.14);
        tone(ctx, out, f * 2, i * 0.08 + 0.01, 0.12, 'triangle', 0.05);
      });
      noise(ctx, out, 0.28, 0.06, 0.08, 3000);
      return 500;
    }),
};
