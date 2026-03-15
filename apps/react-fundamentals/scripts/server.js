'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { getCatalog, runSelector } = require('./runner');

const app = express();
const port = 4311;

const qcmFile = path.join(__dirname, 'qcm.json');

app.use(cors());
app.use(express.json());

app.get('/api/modes', (_req, res) => {
  res.json({ modes: ['code', 'qcm'] });
});

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

app.get('/api/qcm', (_req, res) => {
  if (!fs.existsSync(qcmFile)) return res.json({ questions: [] });
  const data = JSON.parse(fs.readFileSync(qcmFile, 'utf8'));
  res.json(data);
});

app.listen(port, () => {
  console.log(`test-api listening on http://localhost:${port}`);
});
