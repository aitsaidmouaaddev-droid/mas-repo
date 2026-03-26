const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const appRoot = path.join(__dirname, '..');
const workspaceRoot = path.join(appRoot, '..', '..');
const codingDir = path.join(appRoot, 'src', 'coding');
const vitestBin = path.join(workspaceRoot, 'node_modules', '.bin', 'vitest');

function parseSelector(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;

  const m3 = /^(\d+)-(\d+)-(\d+)$/.exec(raw);
  if (m3)
    return {
      moduleIndex: Number(m3[1]),
      fileIndex: Number(m3[2]),
      testIndex: Number(m3[3]),
    };

  const m2 = /^(\d+)-(\d+)$/.exec(raw);
  if (m2)
    return {
      moduleIndex: Number(m2[1]),
      fileIndex: Number(m2[2]),
      testIndex: null,
    };

  return null;
}

function listModules() {
  if (!fs.existsSync(codingDir)) return [];
  return fs
    .readdirSync(codingDir)
    .filter((name) => /^\d+/.test(name) && fs.statSync(path.join(codingDir, name)).isDirectory())
    .sort();
}

function listTestFiles(moduleName) {
  const moduleDir = path.join(codingDir, moduleName);
  return fs
    .readdirSync(moduleDir)
    .filter((name) => name.endsWith('.test.tsx') || name.endsWith('.test.ts'))
    .filter((name) => /^\d+/.test(name))
    .sort();
}

function parseTestTitles(testFilePath) {
  const source = fs.readFileSync(testFilePath, 'utf8');
  const tests = [];
  const re = /(?:it|test)\(\s*(['"`])([\s\S]*?)\1\s*,/g;

  let match;
  while ((match = re.exec(source)) !== null) {
    const title = String(match[2] || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (title) tests.push(title);
  }

  return tests;
}

function getCatalog() {
  const modules = listModules();
  return modules.map((moduleName, mi) => {
    const files = listTestFiles(moduleName).map((fileName, fi) => {
      const filePath = path.join(codingDir, moduleName, fileName);
      const tests = parseTestTitles(filePath).map((title, ti) => ({
        selector: `${mi + 1}-${fi + 1}-${ti + 1}`,
        title,
      }));
      return {
        selector: `${mi + 1}-${fi + 1}`,
        fileName,
        tests,
      };
    });

    return {
      moduleIndex: mi + 1,
      moduleName,
      files,
    };
  });
}

function resolveSelector(selector) {
  const parsed = parseSelector(selector);
  if (!parsed) throw new Error(`Invalid selector: "${selector}"`);

  const modules = listModules();
  const moduleName = modules[parsed.moduleIndex - 1];
  if (!moduleName) throw new Error(`Module not found: ${parsed.moduleIndex}`);

  const files = listTestFiles(moduleName);
  const testFileName = files[parsed.fileIndex - 1];
  if (!testFileName) throw new Error(`File not found: ${parsed.moduleIndex}-${parsed.fileIndex}`);

  const testFilePath = path.join(codingDir, moduleName, testFileName);
  const tests = parseTestTitles(testFilePath);

  let testNamePattern = null;
  if (parsed.testIndex != null) {
    const title = tests[parsed.testIndex - 1];
    if (!title) throw new Error(`Test not found: ${selector}`);
    testNamePattern = `^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
  }

  return { testFilePath, testNamePattern };
}

function runSelector(selector) {
  return new Promise((resolve) => {
    const { testFilePath, testNamePattern } = resolveSelector(selector);
    const outputFile = path.join(
      os.tmpdir(),
      `vitest-result-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
    );

    const args = ['run', '--reporter=json', '--outputFile', outputFile, testFilePath];

    if (testNamePattern) {
      args.push('--testNamePattern', testNamePattern);
    }

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
          /* ignore cleanup error */
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

module.exports = { getCatalog, runSelector };
