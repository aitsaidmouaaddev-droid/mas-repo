/**
 * Tiny Web Audio API sound generator — no external deps.
 * Creates short synthesised tones for game events.
 */

type OscType = OscillatorType;

// ─── Helpers ────────────────────────────────────────────────────────────────

function tone(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  type: OscType,
  peak: number,
  freqEnd?: number,
  detune = 0,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime + startTime;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.detune.setValueAtTime(detune, t);
  if (freqEnd !== undefined)
    osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration * 0.9);

  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(peak, t + 0.008); // fast attack
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration); // decay to silence

  osc.connect(gain);
  gain.connect(dest);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

function noise(
  ctx: AudioContext,
  dest: AudioNode,
  startTime: number,
  duration: number,
  peak: number,
  filterFreq = 2000,
  filterQ = 1,
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
  filter.Q.value = filterQ;

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
    master.gain.value = 1;
    master.connect(ctx.destination);
    const closeAfter = fn(ctx, master);
    setTimeout(() => ctx.close(), closeAfter + 300);
  } catch {
    // SSR / AudioContext unavailable — ignore
  }
}

// ─── Sound effects ───────────────────────────────────────────────────────────

export const sfx = {
  /** Energetic three-stage launch ramp — builds anticipation */
  start: () =>
    withCtx((ctx, out) => {
      // Low punchy thud to kick things off
      tone(ctx, out, 90, 0, 0.18, 'sine', 0.35, 45);
      // Noise snap on the thud
      noise(ctx, out, 0, 0.12, 0.18, 180, 2);

      // Rising arpeggio: pentatonic feel, each note with a little shimmer
      const arp = [220, 277, 330, 440, 554, 659, 880];
      arp.forEach((f, i) => {
        const t = 0.06 + i * 0.065;
        tone(ctx, out, f, t, 0.14, 'triangle', 0.13);
        tone(ctx, out, f * 2, t, 0.1, 'sine', 0.05); // octave shimmer
      });

      // Final stab chord — full and bright
      const chord = [440, 554, 659, 880];
      chord.forEach((f) => tone(ctx, out, f, 0.55, 0.35, 'sine', 0.14));
      noise(ctx, out, 0.55, 0.08, 0.12, 3000, 0.8);

      return 900;
    }),

  /** Snappy micro-blip on every turn — present but never distracting */
  direction: () =>
    withCtx((ctx, out) => {
      // Tight resonant click: high-Q bandpass noise + short pitched blip
      noise(ctx, out, 0, 0.03, 0.12, 1800, 6);
      tone(ctx, out, 900, 0, 0.04, 'triangle', 0.07, 700);
      return 80;
    }),

  /** Juicy "collect" hit — rising chirp + harmonic crunch */
  eat: () =>
    withCtx((ctx, out) => {
      // Main chirp sweeping up a fifth
      tone(ctx, out, 440, 0, 0.09, 'sine', 0.22, 660);
      // Harmonic an octave up, slight delay for sparkle
      tone(ctx, out, 880, 0.04, 0.09, 'sine', 0.1, 1320);
      // Crispy transient noise
      noise(ctx, out, 0, 0.05, 0.14, 2400, 1.5);
      // Sub thump to give it weight
      tone(ctx, out, 110, 0, 0.07, 'sine', 0.18, 80);
      return 200;
    }),

  /** Cheerful jingle when eating yellow special food — bright ascending arpeggio */
  eatYellow: () =>
    withCtx((ctx, out) => {
      // Bright ascending major arpeggio: C5–E5–G5
      const notes = [523, 659, 784];
      notes.forEach((f, i) => {
        const t = i * 0.07;
        tone(ctx, out, f, t, 0.18, 'sine', 0.18);
        tone(ctx, out, f * 2, t + 0.02, 0.12, 'triangle', 0.06); // shimmer
      });
      // Sparkle noise on top
      noise(ctx, out, 0.1, 0.08, 0.1, 3500, 1.2);
      // Sub thump for punch
      tone(ctx, out, 130, 0, 0.1, 'sine', 0.15, 80);
      return 350;
    }),

  /** Extra cheerful fanfare when eating green special food — full chord celebration */
  eatGreen: () =>
    withCtx((ctx, out) => {
      // Rising major arpeggio: C5–E5–G5–C6, each with harmonic
      const notes = [523, 659, 784, 1047];
      notes.forEach((f, i) => {
        const t = i * 0.065;
        tone(ctx, out, f, t, 0.22, 'sine', 0.16);
        tone(ctx, out, f * 1.5, t + 0.01, 0.16, 'triangle', 0.07); // fifth shimmer
        tone(ctx, out, f * 2, t + 0.02, 0.12, 'sine', 0.04); // octave sparkle
      });
      // Triumphant final chord: C5+E5+G5+C6 together
      const chord = [523, 659, 784, 1047];
      chord.forEach((f) => tone(ctx, out, f, 0.3, 0.35, 'sine', 0.12));
      // Crystalline high sparkle
      [2093, 2637, 3136].forEach((f, i) =>
        tone(ctx, out, f, 0.32 + i * 0.03, 0.15, 'triangle', 0.04),
      );
      // Crispy transient + sub
      noise(ctx, out, 0.0, 0.06, 0.12, 3000, 1.5);
      noise(ctx, out, 0.3, 0.06, 0.08, 4000, 1);
      tone(ctx, out, 100, 0, 0.12, 'sine', 0.2, 60);
      return 700;
    }),

  /** Dramatic death crash — impact, detuned wail, rumbling decay */
  die: () =>
    withCtx((ctx, out) => {
      // Initial impact burst
      noise(ctx, out, 0, 0.18, 0.3, 600, 0.7);
      noise(ctx, out, 0, 0.1, 0.18, 4000, 1.0);

      // Detuned sawtooth pair wailing downward — the "oof"
      tone(ctx, out, 380, 0, 0.55, 'sawtooth', 0.2, 55);
      tone(ctx, out, 380, 0, 0.55, 'sawtooth', 0.12, 52, 18); // detuned twin

      // Low sub boom
      tone(ctx, out, 95, 0, 0.3, 'sine', 0.28, 40);

      // High-pitched metallic whine fading out
      tone(ctx, out, 1200, 0.05, 0.5, 'sine', 0.07, 180);

      return 700;
    }),

  /** Triumphant fanfare — escalating chord hits + sparkle on the peak */
  newBest: () =>
    withCtx((ctx, out) => {
      // Three rising chord punches
      const chords = [
        { t: 0.0, freqs: [261, 329, 392], gain: 0.12 },
        { t: 0.18, freqs: [329, 415, 523], gain: 0.13 },
        { t: 0.36, freqs: [392, 494, 659], gain: 0.14 },
        // The big payoff chord
        { t: 0.56, freqs: [523, 659, 784, 1047], gain: 0.16 },
      ];

      chords.forEach(({ t, freqs, gain }) =>
        freqs.forEach((f) => tone(ctx, out, f, t, 0.28, 'sine', gain)),
      );

      // Noise punch on each chord hit for snap
      [0, 0.18, 0.36, 0.56].forEach((t) => noise(ctx, out, t, 0.07, 0.1, 2500, 1));

      // Crystalline high sparkle on the final chord
      [2093, 2637, 3136].forEach((f, i) =>
        tone(ctx, out, f, 0.56 + i * 0.04, 0.2, 'triangle', 0.05),
      );

      // Sub bass swell under the finale
      tone(ctx, out, 65, 0.56, 0.55, 'sine', 0.2, 55);

      return 1100;
    }),
};
