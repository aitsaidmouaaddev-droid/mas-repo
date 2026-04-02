// ── Background music per city ─────────────────────────────────────────────────
// Simple Web Audio API step-sequencer — one repeating melody loop per world.

let _ctx: AudioContext | null = null;
let _masterGain: GainNode | null = null;
let _stopLoop: (() => void) | null = null;

function getCtx(): AudioContext {
  if (!_ctx) {
    _ctx = new AudioContext();
    _masterGain = _ctx.createGain();
    _masterGain.gain.value = 0.06;
    _masterGain.connect(_ctx.destination);
  }
  return _ctx;
}

function resume() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
}

// ── Per-note scheduling ───────────────────────────────────────────────────────

interface Note {
  freq: number;
  beats: number;
}

interface Theme {
  bpm: number;
  type: OscillatorType;
  notes: Note[];
}

const n = (freq: number, beats: number): Note => ({ freq, beats });

// ── City themes (index matches world registry) ────────────────────────────────

const THEMES: Theme[] = [
  // 0 — Marrakech: pentatonic minor, warm triangle, moderate tempo
  {
    bpm: 108,
    type: 'triangle',
    notes: [
      n(294, 1),
      n(330, 0.5),
      n(392, 0.5),
      n(440, 1),
      n(392, 0.5),
      n(330, 0.5),
      n(294, 1.5),
      n(0, 0.5),
      n(392, 1),
      n(440, 0.5),
      n(523, 0.5),
      n(440, 1),
      n(392, 1),
      n(330, 0.5),
      n(294, 0.5),
      n(261, 2),
      n(0, 0.5),
    ],
  },

  // 1 — Fès: Maqam Hijaz feel (b2, #3), sine, slower
  {
    bpm: 90,
    type: 'sine',
    notes: [
      n(294, 1),
      n(311, 0.5),
      n(370, 0.5),
      n(392, 1),
      n(370, 0.5),
      n(311, 0.5),
      n(294, 2),
      n(466, 1),
      n(440, 0.5),
      n(392, 0.5),
      n(370, 1),
      n(311, 1),
      n(294, 1),
      n(0, 1),
      n(392, 0.5),
      n(440, 0.5),
      n(466, 2),
      n(0, 1),
    ],
  },

  // 2 — Chefchaouen: bright major scale, square softened, upbeat
  {
    bpm: 140,
    type: 'square',
    notes: [
      n(523, 0.5),
      n(587, 0.5),
      n(659, 0.5),
      n(698, 0.5),
      n(784, 1),
      n(698, 0.5),
      n(659, 0.5),
      n(587, 0.5),
      n(523, 0.5),
      n(494, 0.5),
      n(523, 1.5),
      n(0, 0.5),
      n(659, 0.5),
      n(784, 0.5),
      n(880, 1),
      n(784, 0.5),
      n(659, 2),
      n(0, 1),
    ],
  },

  // 3 — Essaouira: Dorian mode, wind-like triangle, flowing
  {
    bpm: 112,
    type: 'triangle',
    notes: [
      n(294, 1),
      n(330, 0.5),
      n(349, 0.5),
      n(392, 1),
      n(440, 1),
      n(494, 0.5),
      n(440, 0.5),
      n(392, 1),
      n(349, 1),
      n(330, 0.5),
      n(294, 0.5),
      n(247, 2),
      n(0, 0.5),
      n(440, 1),
      n(392, 0.5),
      n(349, 0.5),
      n(392, 2),
      n(0, 1),
    ],
  },
];

// ── Playback engine ───────────────────────────────────────────────────────────

function playTheme(theme: Theme, masterGain: GainNode): () => void {
  const ctx = getCtx();
  const beatMs = 60_000 / theme.bpm;
  let running = true;
  let timeoutId: ReturnType<typeof setTimeout>;

  function scheduleLoop() {
    if (!running) return;
    let t = ctx.currentTime + 0.05; // small lead

    for (const note of theme.notes) {
      const dur = note.beats * (beatMs / 1000);
      if (note.freq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = theme.type;
        if (theme.type === 'square') osc.detune.value = -1200; // soften by going down an octave
        osc.frequency.value = note.freq;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(1, t + 0.02);
        gain.gain.setValueAtTime(1, t + dur * 0.6);
        gain.gain.linearRampToValueAtTime(0, t + dur * 0.95);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t);
        osc.stop(t + dur);
      }
      t += note.beats * (beatMs / 1000);
    }

    const loopDurationMs = theme.notes.reduce((s, n) => s + n.beats, 0) * beatMs;
    timeoutId = setTimeout(scheduleLoop, loopDurationMs - 100);
  }

  scheduleLoop();
  return () => {
    running = false;
    clearTimeout(timeoutId);
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

let _currentWorld = -1;

export function startMusic(worldIndex: number) {
  resume();
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => startMusic(worldIndex));
    return;
  }
  if (_currentWorld === worldIndex) return; // already playing this theme
  stopMusic();
  const theme = THEMES[worldIndex] ?? THEMES[0];
  _currentWorld = worldIndex;
  _stopLoop = playTheme(theme, _masterGain!);
}

export function stopMusic() {
  _stopLoop?.();
  _stopLoop = null;
  _currentWorld = -1;
}

export function setMusicVolume(v: number) {
  if (_masterGain) _masterGain.gain.value = Math.max(0, Math.min(0.15, v));
}
