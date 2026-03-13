/**
 * Interactive solution runner for js-fundamentals.
 *
 * Supported selectors:
 *   a-b     -> module a, subject b (run all tests in subject)
 *   a-b-c   -> module a, subject b, exercise c (show only one exercise result)
 *
 * Examples:
 *   node scripts/solution.js 1-1
 *   node scripts/solution.js 3-1-4
 *   node scripts/solution.js 3-1-4 --show-solution
 *   node scripts/solution.js --interactive
 */

'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');
const chalk = require('chalk');

const EMOJI = {
  rocket: '🚀',
  game: '🎮',
  sparkles: '✨',
  test: '🧪',
  menu: '📋',
  ok: '✅',
  fail: '❌',
  bulb: '💡',
  wave: '👋',
};

const srcDir = path.join(__dirname, '..', 'src');

function clearScreen() {
  if (!process.stdout.isTTY) return;
  process.stdout.write('\x1Bc');
}

function createRl() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl, promptText) {
  return new Promise((resolve) => rl.question(promptText, resolve));
}

function askForKey(promptText, allowedKeys) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const wasRaw = Boolean(stdin.isRaw);

    process.stdout.write(promptText);
    readline.emitKeypressEvents(stdin);
    if (stdin.isTTY) stdin.setRawMode(true);

    function cleanup() {
      stdin.removeListener('keypress', onKeypress);
      if (stdin.isTTY) stdin.setRawMode(wasRaw);
    }

    function onKeypress(_str, key) {
      if (key && key.ctrl && key.name === 'c') {
        cleanup();
        process.stdout.write('^C\n');
        process.exit(130);
      }

      const pressed = (key && key.name ? key.name : '').toLowerCase();
      if (!allowedKeys.includes(pressed)) {
        return;
      }

      cleanup();
      process.stdout.write(`${pressed}\n`);
      resolve(pressed);
    }

    stdin.on('keypress', onKeypress);
  });
}

function parseSelector(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  const m2 = /^(\d+)-(\d+)$/.exec(raw);
  if (m2) {
    return {
      moduleIndex: Number(m2[1]),
      subjectIndex: Number(m2[2]),
      questionIndex: null,
      raw,
    };
  }
  const m3 = /^(\d+)-(\d+)-(\d+)$/.exec(raw);
  if (m3) {
    return {
      moduleIndex: Number(m3[1]),
      subjectIndex: Number(m3[2]),
      questionIndex: Number(m3[3]),
      raw,
    };
  }
  return null;
}

function listModules() {
  return fs
    .readdirSync(srcDir)
    .filter((f) => /^\d+/.test(f) && fs.statSync(path.join(srcDir, f)).isDirectory())
    .sort();
}

function resolveSelection(sel) {
  const modules = listModules();
  const moduleName = modules[sel.moduleIndex - 1];

  if (!moduleName) {
    throw new Error(`Module ${sel.moduleIndex} not found (available: 1-${modules.length}).`);
  }

  const moduleDir = path.join(srcDir, moduleName);
  const subjects = fs
    .readdirSync(moduleDir)
    .filter((f) => f.endsWith('.js') && !f.endsWith('.solution.js'))
    .sort();

  if (subjects.length === 0) {
    throw new Error(`No exercise files in ${moduleName}.`);
  }

  const exerciseFileName = subjects[sel.subjectIndex - 1];
  if (!exerciseFileName) {
    throw new Error(
      `Subject ${sel.subjectIndex} not found in ${moduleName} (available: 1-${subjects.length}).`,
    );
  }

  const solutionJsonFileName = exerciseFileName.replace(/\.js$/, '.solution.json');
  const exerciseFilePath = path.join(moduleDir, exerciseFileName);
  const solutionJsonPath = path.join(moduleDir, solutionJsonFileName);

  return {
    moduleName,
    moduleDir,
    subjects,
    exerciseFileName,
    solutionJsonFileName,
    exerciseFilePath,
    solutionJsonPath,
    selector: sel,
  };
}

function parseExerciseBlocks(fileText) {
  const lines = fileText.split('\n');
  const starts = [];
  const markerRe = /^\s*\/\/\s*(?:─+\s*)?Exercise\s+(\d+)\s+—\s+(.*)$/;

  for (let i = 0; i < lines.length; i++) {
    const match = markerRe.exec(lines[i]);
    if (match) {
      starts.push({
        index: i,
        exerciseNumber: Number(match[1]),
        title: match[2].trim(),
      });
    }
  }

  return starts.map((start, idx) => {
    const end = idx + 1 < starts.length ? starts[idx + 1].index : lines.length;
    const blockText = lines.slice(start.index, end).join('\n');
    const links = Array.from(new Set(blockText.match(/https?:\/\/\S+/g) || []));

    return {
      exerciseNumber: start.exerciseNumber,
      title: start.title,
      blockText,
      links,
    };
  });
}

function runFile(filePath, sourceOverride) {
  let actualPath = filePath;
  let tempDir = null;

  if (typeof sourceOverride === 'string') {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsfund-'));
    actualPath = path.join(tempDir, path.basename(filePath));
    fs.writeFileSync(actualPath, sourceOverride, 'utf8');
  }

  const result = spawnSync('node', [actualPath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (tempDir) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (err) {
      void err;
    }
  }

  const out = `${result.stdout || ''}${result.stderr || ''}`;
  return {
    code: result.status ?? 1,
    output: out,
  };
}

function printOfficialLinks(links) {
  if (!links.length) return;
  console.log(chalk.bold.yellow(`  ${EMOJI.bulb} Official docs`));
  for (const link of links) {
    console.log(chalk.cyan(`  ${link}`));
  }
  console.log('');
}

function readSolutionJson(solutionJsonPath) {
  if (!fs.existsSync(solutionJsonPath)) {
    throw new Error(`Missing ${path.basename(solutionJsonPath)}. Run: npm run js:sync-solutions`);
  }

  const data = JSON.parse(fs.readFileSync(solutionJsonPath, 'utf8'));

  if (!data || typeof data !== 'object') {
    throw new Error(`Invalid JSON in ${path.basename(solutionJsonPath)}: root must be an object.`);
  }

  if (data.version !== 1) {
    throw new Error(`Invalid ${path.basename(solutionJsonPath)}: expected version 1.`);
  }

  if (!Array.isArray(data.exercises)) {
    throw new Error(`Invalid ${path.basename(solutionJsonPath)}: exercises must be an array.`);
  }

  for (const exercise of data.exercises) {
    if (!exercise || typeof exercise !== 'object') {
      throw new Error(
        `Invalid ${path.basename(solutionJsonPath)}: each exercise must be an object.`,
      );
    }

    if (!Number.isInteger(exercise.exerciseNumber) || exercise.exerciseNumber < 1) {
      throw new Error(
        `Invalid ${path.basename(solutionJsonPath)}: exerciseNumber must be a positive integer.`,
      );
    }

    if (typeof exercise.title !== 'string' || exercise.title.trim() === '') {
      throw new Error(
        `Invalid ${path.basename(solutionJsonPath)}: each exercise needs a non-empty title.`,
      );
    }

    if (typeof exercise.content !== 'string' || exercise.content.trim() === '') {
      throw new Error(
        `Invalid ${path.basename(solutionJsonPath)}: each exercise needs non-empty content.`,
      );
    }

    if (exercise.links !== undefined && !Array.isArray(exercise.links)) {
      throw new Error(
        `Invalid ${path.basename(solutionJsonPath)}: links must be an array when provided.`,
      );
    }
  }

  return data;
}

function printHighlightedText(text, headerTitle, links = []) {
  const lines = text.split('\n');

  console.log('');
  console.log(chalk.bold.cyan(`  ${EMOJI.sparkles} ${headerTitle}`));
  console.log(chalk.bold.cyan('  ───────────────────────────────────────────────────────────'));

  lines.forEach((line, i) => {
    const lineNo = chalk.dim(String(i + 1).padStart(4) + ' │ ');
    const trimmed = line.trimStart();

    if (
      trimmed.startsWith('// WHY:') ||
      trimmed.startsWith('// WHEN:') ||
      trimmed.startsWith('// WHERE:')
    ) {
      console.log(lineNo + chalk.yellow(line));
    } else if (trimmed.startsWith('// CONCEPT:') || trimmed.startsWith('// MDN:')) {
      console.log(lineNo + chalk.cyan(line));
    } else if (
      trimmed.startsWith('// ═') ||
      trimmed.startsWith('// ─') ||
      trimmed.startsWith('// LEVEL')
    ) {
      console.log(lineNo + chalk.bold.white(line));
    } else if (trimmed.startsWith('//')) {
      console.log(lineNo + chalk.dim(line));
    } else if (
      trimmed.startsWith('function ') ||
      trimmed.startsWith('const ') ||
      trimmed.startsWith('class ') ||
      trimmed.startsWith('async function')
    ) {
      console.log(lineNo + chalk.green(line));
    } else {
      console.log(lineNo + line);
    }
  });

  console.log('');
  printOfficialLinks(links);
}

function printSolutionWithHighlights(solutionJsonPath, headerTitle, exerciseIndex = null) {
  const solutionData = readSolutionJson(solutionJsonPath);

  if (exerciseIndex == null) {
    const combinedText = solutionData.exercises.map((exercise) => exercise.content).join('\n\n');
    const combinedLinks = Array.from(
      new Set(solutionData.exercises.flatMap((exercise) => exercise.links || [])),
    );
    return printHighlightedText(combinedText, headerTitle, combinedLinks);
  }

  const exercise =
    solutionData.exercises.find((item) => item.exerciseNumber === exerciseIndex) ||
    solutionData.exercises[exerciseIndex - 1];

  if (!exercise) {
    console.log(chalk.red(`  ${EMOJI.fail} Exercise ${exerciseIndex} not found in solution JSON.`));
    return;
  }

  return printHighlightedText(
    exercise.content,
    `${headerTitle} | Exercise ${exercise.exerciseNumber} — ${exercise.title}`,
    exercise.links || [],
  );
}

function printSelectedSolution(ctx, exerciseIndex = null) {
  const title = `SOLUTION ${ctx.selector.moduleIndex}-${ctx.selector.subjectIndex} | ${ctx.moduleName}/${ctx.exerciseFileName.replace('.js', '')}`;
  printSolutionWithHighlights(ctx.solutionJsonPath, title, exerciseIndex);
}

function buildExerciseCatalog() {
  const catalog = [];
  const modules = listModules();

  for (let moduleOffset = 0; moduleOffset < modules.length; moduleOffset++) {
    const moduleName = modules[moduleOffset];
    const moduleDir = path.join(srcDir, moduleName);
    const subjects = fs
      .readdirSync(moduleDir)
      .filter((f) => f.endsWith('.js') && !f.endsWith('.solution.js'))
      .sort();

    for (let subjectOffset = 0; subjectOffset < subjects.length; subjectOffset++) {
      const exerciseFileName = subjects[subjectOffset];
      const exerciseFilePath = path.join(moduleDir, exerciseFileName);
      const exerciseBlocks = parseExerciseBlocks(fs.readFileSync(exerciseFilePath, 'utf8'));

      for (const block of exerciseBlocks) {
        catalog.push({
          moduleIndex: moduleOffset + 1,
          subjectIndex: subjectOffset + 1,
          questionIndex: block.exerciseNumber,
          moduleName,
          exerciseFileName,
          title: block.title,
        });
      }
    }
  }

  return catalog;
}

function getAdjacentExerciseSelection(sel, delta) {
  if (sel.questionIndex == null) {
    return null;
  }

  const catalog = buildExerciseCatalog();
  const currentIndex = catalog.findIndex(
    (item) =>
      item.moduleIndex === sel.moduleIndex &&
      item.subjectIndex === sel.subjectIndex &&
      item.questionIndex === sel.questionIndex,
  );

  if (currentIndex === -1) {
    return null;
  }

  return catalog[currentIndex + delta] || null;
}

function buildFilteredExerciseSource(filePath, exerciseIndex) {
  const fileText = fs.readFileSync(filePath, 'utf8');
  const lines = fileText.split('\n');
  const output = [];
  let currentExercise = 0;
  const markerRe = /^\s*\/\/\s*(?:─+\s*)?Exercise\s+(\d+)\s+—\s+(.*)$/;

  output.push(`global.__TARGET_EXERCISE__ = ${exerciseIndex};`);
  output.push('global.__CURRENT_EXERCISE__ = 0;');
  output.push(
    'function __shouldRunExercise() { return global.__CURRENT_EXERCISE__ === global.__TARGET_EXERCISE__; }',
  );
  output.push(
    'function __exerciseTest(...args) { if (__shouldRunExercise()) return test(...args); }',
  );
  output.push(
    'function __exerciseTestAsync(...args) { if (__shouldRunExercise()) return testAsync(...args); }',
  );

  for (const line of lines) {
    const marker = markerRe.exec(line);
    if (marker) {
      currentExercise = Number(marker[1]);
      output.push(line);
      output.push(`global.__CURRENT_EXERCISE__ = ${currentExercise};`);
      continue;
    }

    if (currentExercise > 0 && /^\s*testAsync\(/.test(line)) {
      output.push(
        line.replace(/^\s*testAsync\(/, (m) => m.replace('testAsync(', '__exerciseTestAsync(')),
      );
      continue;
    }

    if (currentExercise > 0 && /^\s*test\(/.test(line)) {
      output.push(line.replace(/^\s*test\(/, (m) => m.replace('test(', '__exerciseTest(')));
      continue;
    }

    if (currentExercise > 0 && /^\s*console\.log\(/.test(line)) {
      output.push(`if (__shouldRunExercise()) ${line.trimStart()}`);
      continue;
    }

    output.push(line);
  }

  return output.join('\n');
}

function printExerciseResult(ctx, exerciseIndex) {
  const blocks = parseExerciseBlocks(fs.readFileSync(ctx.exerciseFilePath, 'utf8'));
  const block = blocks[exerciseIndex - 1];
  if (!block) {
    console.log(chalk.red(`  ${EMOJI.fail} Exercise ${exerciseIndex} not found in this subject.`));
    return;
  }

  const filteredSource = buildFilteredExerciseSource(ctx.exerciseFilePath, exerciseIndex);
  const run = runFile(ctx.exerciseFilePath, filteredSource);

  console.log('');
  console.log(
    chalk.bold.cyan(
      `  ${EMOJI.test} Running ${ctx.selector.moduleIndex}-${ctx.selector.subjectIndex}-${exerciseIndex}`,
    ),
  );
  console.log(
    chalk.dim(
      `  ${ctx.moduleName}/${ctx.exerciseFileName.replace('.js', '')} | Exercise ${block.exerciseNumber} — ${block.title}`,
    ),
  );
  console.log(chalk.bold.cyan('  ── Tests ──────────────────────────────────────────'));
  console.log('');
  process.stdout.write(run.output.trimEnd() + '\n\n');
}

function printWholeSubject(ctx) {
  const run = runFile(ctx.exerciseFilePath);
  const text = run.output;

  console.log('');
  console.log(
    chalk.bold.cyan(
      `  ${EMOJI.test} Running ${ctx.selector.moduleIndex}-${ctx.selector.subjectIndex}`,
    ),
  );
  console.log(chalk.dim(`  ${ctx.moduleName}/${ctx.exerciseFileName.replace('.js', '')}`));
  console.log(chalk.bold.cyan('  ── Tests ──────────────────────────────────────────'));
  console.log('');

  process.stdout.write(text.trimEnd() + '\n\n');
}

function printWelcome() {
  clearScreen();
  console.log('');
  console.log(
    chalk.bold.magenta(`  ${EMOJI.game} JS Fundamentals Interactive Mode ${EMOJI.rocket}`),
  );
  console.log(
    chalk.dim('  Type a selector: a-b-c (module-subject-exercise) or a-b (whole subject).'),
  );
  console.log(chalk.dim('  Examples: 3-1-4, 1-1'));
  console.log(chalk.dim('  Quit anytime with q or Ctrl+C.'));
  console.log('');
}

async function interactiveMenuLoop(rl, initialCtx) {
  let currentCtx = initialCtx;
  let currentExercise = currentCtx.selector.questionIndex || 1;

  if (currentCtx.selector.questionIndex == null) {
    printWholeSubject(currentCtx);
  } else {
    printExerciseResult(currentCtx, currentExercise);
  }

  while (true) {
    const exerciseBlocks = parseExerciseBlocks(
      fs.readFileSync(currentCtx.exerciseFilePath, 'utf8'),
    );
    const previousExercise =
      currentCtx.selector.questionIndex == null
        ? null
        : getAdjacentExerciseSelection(
            {
              moduleIndex: currentCtx.selector.moduleIndex,
              subjectIndex: currentCtx.selector.subjectIndex,
              questionIndex: currentExercise,
            },
            -1,
          );
    const nextExercise =
      currentCtx.selector.questionIndex == null
        ? null
        : getAdjacentExerciseSelection(
            {
              moduleIndex: currentCtx.selector.moduleIndex,
              subjectIndex: currentCtx.selector.subjectIndex,
              questionIndex: currentExercise,
            },
            1,
          );

    console.log(chalk.bold.yellow(`  ${EMOJI.menu} What next?`));
    console.log(chalk.yellow('  [s] Show solution + explanations'));
    console.log(chalk.yellow('  [r] Rerun same test'));
    console.log(chalk.yellow('  [a] Rerun another test in this subject'));
    if (previousExercise) {
      console.log(
        chalk.yellow(
          `  [p] Previous exercise (${previousExercise.moduleIndex}-${previousExercise.subjectIndex}-${previousExercise.questionIndex} | ${previousExercise.title})`,
        ),
      );
    }
    if (nextExercise) {
      console.log(
        chalk.yellow(
          `  [n] Next exercise (${nextExercise.moduleIndex}-${nextExercise.subjectIndex}-${nextExercise.questionIndex} | ${nextExercise.title})`,
        ),
      );
    }
    console.log(chalk.yellow('  [x] Run another a-b-c'));
    console.log(chalk.yellow('  [q] Quit'));

    const allowedKeys = ['s', 'r', 'a', 'x', 'q'];
    if (previousExercise) allowedKeys.push('p');
    if (nextExercise) allowedKeys.push('n');

    const answer = await askForKey(chalk.cyan('  > '), allowedKeys);
    clearScreen();

    if (answer === 'q') {
      console.log(chalk.green(`\n  ${EMOJI.wave} Bye! Keep practicing.`));
      process.exit(0);
    }

    if (answer === 's') {
      printSelectedSolution(
        currentCtx,
        currentCtx.selector.questionIndex == null ? null : currentExercise,
      );
      continue;
    }

    if (answer === 'r') {
      if (currentCtx.selector.questionIndex == null) {
        printWholeSubject(currentCtx);
      } else {
        printExerciseResult(currentCtx, currentExercise);
      }
      continue;
    }

    if (answer === 'a') {
      const maxQ = exerciseBlocks.length || 1;
      const qText = await ask(rl, chalk.cyan(`  Enter exercise number (1-${maxQ}): `));
      clearScreen();
      const q = Number(String(qText).trim());
      if (!Number.isInteger(q) || q < 1 || q > maxQ) {
        console.log(chalk.red(`  ${EMOJI.fail} Invalid exercise number.`));
        continue;
      }
      currentExercise = q;
      printExerciseResult(currentCtx, currentExercise);
      continue;
    }

    if (answer === 'p') {
      currentCtx = resolveSelection(previousExercise);
      currentExercise = previousExercise.questionIndex;
      printExerciseResult(currentCtx, currentExercise);
      continue;
    }

    if (answer === 'n') {
      currentCtx = resolveSelection(nextExercise);
      currentExercise = nextExercise.questionIndex;
      printExerciseResult(currentCtx, currentExercise);
      continue;
    }

    if (answer === 'x') {
      return;
    }

    console.log(chalk.red(`  ${EMOJI.fail} Unknown option. Choose one of the menu keys.`));
  }
}

function printUsage() {
  console.log('');
  console.log(chalk.bold.red(`  ${EMOJI.fail} Missing or invalid argument.`));
  console.log(chalk.dim('  Usage: node scripts/solution.js <a-b | a-b-c> [--show-solution]'));
  console.log(chalk.dim('  Example: node scripts/solution.js 3-1-4 --show-solution'));
  console.log(chalk.dim('  Or:      node scripts/solution.js --interactive'));
  console.log('');
}

function runOneShot(selectorArg, options = {}) {
  const sel = parseSelector(selectorArg);
  if (!sel) {
    printUsage();
    process.exit(1);
  }

  let ctx;
  try {
    ctx = resolveSelection(sel);
  } catch (err) {
    console.log(chalk.red(`\n  ${EMOJI.fail} ${err.message}`));
    process.exit(1);
  }

  if (sel.questionIndex == null) {
    printWholeSubject(ctx);
    if (options.showSolution) {
      printSelectedSolution(ctx);
    }
    return;
  }

  printExerciseResult(ctx, sel.questionIndex);
  if (options.showSolution) {
    printSelectedSolution(ctx, sel.questionIndex);
  }
}

async function runInteractive() {
  if (!process.stdin.isTTY) {
    console.error(chalk.red(`\n  ${EMOJI.fail} Interactive mode requires a TTY terminal.`));
    process.exit(1);
  }

  const rl = createRl();

  printWelcome();

  while (true) {
    const input = String(await ask(rl, chalk.cyan(`  ${EMOJI.bulb} Enter a-b-c (or q): `))).trim();
    clearScreen();
    if (input.toLowerCase() === 'q') {
      console.log(chalk.green(`\n  ${EMOJI.wave} Bye! Keep practicing.`));
      break;
    }

    const sel = parseSelector(input);
    if (!sel) {
      console.log(chalk.red(`  ${EMOJI.fail} Invalid format. Use a-b-c or a-b.`));
      continue;
    }

    let ctx;
    try {
      ctx = resolveSelection(sel);
    } catch (err) {
      console.log(chalk.red(`  ${EMOJI.fail} ${err.message}`));
      continue;
    }

    await interactiveMenuLoop(rl, ctx);
  }

  rl.close();
}

const args = process.argv.slice(2);
const isInteractive = args.includes('--interactive');
const showSolution = args.includes('--show-solution');
const arg = args.find((value) => !value.startsWith('--'));

if (isInteractive || !arg) {
  runInteractive().catch((err) => {
    console.error(chalk.red(`\n  ${EMOJI.fail} ${err.message}`));
    process.exit(1);
  });
} else {
  runOneShot(arg, { showSolution });
}
