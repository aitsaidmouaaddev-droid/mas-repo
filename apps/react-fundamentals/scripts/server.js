const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { getCatalog, runSelector } = require('./runner');
const { getChallenges, runTdtChallenge } = require('./tdt-runner');

const app = express();
const port = 4311;

const qcmFile = path.join(__dirname, 'qcm.json');

app.use(cors());
app.use(express.json());

// ── Modes ────────────────────────────────────────────────────────────────────

app.get('/api/modes', (_req, res) => {
  res.json({ modes: ['qcm', 'tdt'] });
});

// ── Code exercises ────────────────────────────────────────────────────────────

app.get('/api/code/catalog', (_req, res) => {
  res.json({ modules: getCatalog() });
});

app.post('/api/code/run', async (req, res) => {
  try {
    const { selector } = req.body || {};
    if (!selector || typeof selector !== 'string') {
      return res.status(400).json({ error: 'selector is required' });
    }
    if (!/^\d+-\d+(-\d+)?$/.test(selector)) {
      return res.status(400).json({ error: 'invalid selector format' });
    }
    const result = await runSelector(selector);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      passed: 0,
      failed: 1,
      tests: [],
      logs: String(err?.message || err),
    });
  }
});

// ── QCM ───────────────────────────────────────────────────────────────────────

app.get('/api/qcm', (_req, res) => {
  if (!fs.existsSync(qcmFile)) return res.json({ questions: [] });
  const data = JSON.parse(fs.readFileSync(qcmFile, 'utf8'));
  res.json(data);
});

// ── TDT challenges ────────────────────────────────────────────────────────────

app.get('/api/tdt', (_req, res) => {
  try {
    const challenges = getChallenges();
    res.json({ challenges });
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
});

app.post('/api/tdt/run', async (req, res) => {
  try {
    const { challengeId, impl } = req.body || {};
    if (!challengeId || typeof challengeId !== 'string') {
      return res.status(400).json({ error: 'challengeId is required' });
    }
    if (typeof impl !== 'string') {
      return res.status(400).json({ error: 'impl is required' });
    }
    const result = await runTdtChallenge(challengeId, impl);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      passed: 0,
      failed: 1,
      tests: [],
      logs: String(err?.message || err),
    });
  }
});

app.listen(port, () => {
  console.log(`test-api listening on http://localhost:${port}`);
});
