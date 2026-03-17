const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const appRoot = path.join(__dirname, '..');
const workspaceRoot = path.join(appRoot, '..', '..');
const tdtLiveDir = path.join(appRoot, 'src', 'coding', 'tdt-live');
const vitestBin = path.join(workspaceRoot, 'node_modules', '.bin', 'vitest');
const tdtChallengesFile = path.join(__dirname, 'tdt-challenges.json');

function getChallenges() {
  return JSON.parse(fs.readFileSync(tdtChallengesFile, 'utf8')).challenges;
}

function getChallenge(id) {
  return getChallenges().find((c) => c.id === id) || null;
}

/**
 * Write user impl to src/coding/tdt-live/solution.ts,
 * write testCode to src/coding/tdt-live/solution.test.ts,
 * spawn vitest on that file, return aggregated RunResult.
 */
function runTdtChallenge(challengeId, userImpl) {
  const challenge = getChallenge(challengeId);
  if (!challenge) return Promise.reject(new Error(`Challenge not found: ${challengeId}`));

  fs.mkdirSync(tdtLiveDir, { recursive: true });

  const solutionFile = path.join(tdtLiveDir, 'solution.ts');
  const testFile = path.join(tdtLiveDir, 'solution.test.ts');
  const outputFile = path.join(
    os.tmpdir(),
    `tdt-result-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  );

  fs.writeFileSync(solutionFile, userImpl, 'utf8');
  fs.writeFileSync(testFile, challenge.testCode, 'utf8');

  return new Promise((resolve) => {
    const args = ['run', '--reporter=json', '--outputFile', outputFile, testFile];
    const isWin = process.platform === 'win32';
    const cmd = isWin ? `${vitestBin}.cmd` : vitestBin;

    const child = spawn(cmd, args, {
      cwd: appRoot,
      env: { ...process.env, FORCE_COLOR: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: isWin,
    });

    let logs = '';
    child.stdout.on('data', (d) => (logs += d.toString()));
    child.stderr.on('data', (d) => (logs += d.toString()));

    child.on('close', () => {
      let result = null;
      try {
        result = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      } catch {
        result = null;
      } finally {
        try {
          fs.unlinkSync(outputFile);
        } catch {
          /* ignore */
        }
        try {
          fs.unlinkSync(solutionFile);
        } catch {
          /* ignore */
        }
        try {
          fs.unlinkSync(testFile);
        } catch {
          /* ignore */
        }
      }

      if (!result) {
        resolve({ passed: 0, failed: 1, tests: [], logs });
        return;
      }

      const tests = [];
      for (const suite of result.testResults || []) {
        for (const t of suite.assertionResults || []) {
          tests.push({
            title: t.fullName || t.title || t.name,
            status: t.status,
            failureMessages: t.failureMessages || [],
          });
        }
      }

      resolve({
        passed: result.numPassedTests || 0,
        failed: result.numFailedTests || 0,
        tests,
        logs,
      });
    });
  });
}

module.exports = { getChallenges, getChallenge, runTdtChallenge };
