/**
 * Interactive QCM runner for ts-fundamentals.
 *
 * Modes:
 *   node scripts/qcm.js                    → one-shot: all categories in order
 *   node scripts/qcm.js 3                  → one-shot: category 3
 *   node scripts/qcm.js 3-7                → one-shot: category 3, question 7
 *   node scripts/qcm.js --interactive      → interactive menu, pick category
 *
 * Non-TTY fallback:
 *   If no TTY is available (e.g. Nx terminal capture / CI), one-shot mode
 *   automatically switches to "review mode" and prints correct answers,
 *   explanations, and docs links without keypress input.
 *
 * Each QCM JSON file exports:
 * {
 *   category: string,
 *   questions: [{
 *     id: number,
 *     question: string,
 *     choices: { a, b, c, d },
 *     answer: 'a'|'b'|'c'|'d',
 *     explanation: string,
 *     links: string[]
 *   }]
 * }
 */

'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

const qcmDir = path.join(__dirname, '..', 'src', 'qcm');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clearScreen() {
  if (process.stdout.isTTY) process.stdout.write('\x1Bc');
}

function askForKey(prompt, allowed) {
  const stdin = process.stdin;
  const canUseRawMode = Boolean(stdin.isTTY && typeof stdin.setRawMode === 'function');

  // Fallback for terminals where raw mode is unavailable (common on some
  // Windows/Nx terminal combinations). User can type the answer then Enter.
  if (!canUseRawMode) {
    const rl = createRl();
    return new Promise((resolve) => {
      const askLine = () => {
        rl.question(prompt, (input) => {
          const answer = String(input || '').trim().toLowerCase().charAt(0);
          if (allowed.includes(answer)) {
            rl.close();
            resolve(answer);
            return;
          }
          console.log(chalk.red(`  Invalid choice. Expected: ${allowed.join('/')}`));
          askLine();
        });
      };
      askLine();
    });
  }

  return new Promise((resolve) => {
    const wasRaw = Boolean(stdin.isRaw);
    process.stdout.write(prompt);
    readline.emitKeypressEvents(stdin);
    stdin.setRawMode(true);

    function onKeypress(_str, key) {
      if (key && key.ctrl && key.name === 'c') {
        cleanup();
        process.stdout.write('^C\n');
        process.exit(130);
      }
      const k = (key && key.name ? key.name : '').toLowerCase();
      if (!allowed.includes(k)) return;
      cleanup();
      process.stdout.write('\n');
      resolve(k);
    }

    function cleanup() {
      stdin.removeListener('keypress', onKeypress);
      stdin.setRawMode(wasRaw);
    }

    stdin.on('keypress', onKeypress);
  });
}

function ask(rl, prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function createRl() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

// ─── Load QCM files ───────────────────────────────────────────────────────────

function loadCategories() {
  return fs
    .readdirSync(qcmDir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f, i) => {
      const raw = JSON.parse(fs.readFileSync(path.join(qcmDir, f), 'utf8'));
      return { index: i + 1, file: f, ...raw };
    });
}

// ─── Display ─────────────────────────────────────────────────────────────────

function printCategory(cat) {
  console.log('');
  console.log(chalk.bold.cyan(`  📚  Category ${cat.index}: ${cat.category}`));
  console.log(chalk.dim(`  ${cat.questions.length} questions`));
  console.log('');
}

function printQuestion(cat, q, qIndex) {
  const total = cat.questions.length;
  console.log(
    chalk.bold.white(`  ─── Question ${qIndex}/${total} ─────────────────────────────────────────`),
  );
  console.log('');
  console.log(chalk.bold(`  ${q.question}`));
  console.log('');
  for (const [key, val] of Object.entries(q.choices)) {
    console.log(chalk.cyan(`    ${key})`) + `  ${val}`);
  }
  console.log('');
}

function printResult(q, userAnswer) {
  const correct = userAnswer === q.answer;
  if (correct) {
    console.log(chalk.bold.green(`  ✅  Correct! The answer is (${q.answer}).`));
  } else {
    console.log(
      chalk.bold.red(`  ❌  Wrong. You chose (${userAnswer}), correct is (${q.answer}).`),
    );
  }
  console.log('');
  console.log(chalk.bold('  📖  Explanation:'));
  const lines = q.explanation.split('\n');
  lines.forEach((l) => console.log(chalk.white('     ') + l));
  console.log('');
  if (q.links && q.links.length) {
    console.log(chalk.dim('  🔗  Docs:'));
    q.links.forEach((l) => console.log(chalk.dim(`       ${l}`)));
  }
  console.log('');
  return correct;
}

function printScore(score, total) {
  const pct = Math.round((score / total) * 100);
  const bar = '█'.repeat(Math.round(pct / 5)) + '░'.repeat(20 - Math.round(pct / 5));
  const colour = pct >= 80 ? chalk.bold.green : pct >= 50 ? chalk.bold.yellow : chalk.bold.red;
  console.log(chalk.bold.cyan('\n  ┌─────────────────────────────────────────────┐'));
  console.log(
    chalk.bold.cyan('  │') +
      chalk.bold.white(`  📊  Score: ${score}/${total}  (${pct}%)`.padEnd(45)) +
      chalk.bold.cyan('│'),
  );
  console.log(chalk.bold.cyan('  │') + colour(`  ${bar}  `).padEnd(45) + chalk.bold.cyan('│'));
  console.log(chalk.bold.cyan('  └─────────────────────────────────────────────┘'));
  const msg =
    pct === 100
      ? '🏆  Perfect score! TypeScript master!'
      : pct >= 80
        ? '🎯  Great job! Almost there.'
        : pct >= 50
          ? '💪  Decent — keep practicing!'
          : '📝  Review the explanations above and retry.';
  console.log(chalk.bold(`\n  ${msg}\n`));
}

function printReviewResult(q) {
  console.log(
    chalk.bold.green(
      `  ✅  Review mode: correct answer is (${q.answer}) ${q.choices[q.answer] || ''}`,
    ),
  );
  console.log('');
  console.log(chalk.bold('  📖  Explanation:'));
  const lines = q.explanation.split('\n');
  lines.forEach((l) => console.log(chalk.white('     ') + l));
  console.log('');
  if (q.links && q.links.length) {
    console.log(chalk.dim('  🔗  Docs:'));
    q.links.forEach((l) => console.log(chalk.dim(`       ${l}`)));
  }
  console.log('');
}

// ─── Run a question (interactive keypress) ────────────────────────────────────

async function runQuestion(cat, q, qIndex) {
  printQuestion(cat, q, qIndex);
  const answer = await askForKey(chalk.dim('  Your answer (a/b/c/d): '), ['a', 'b', 'c', 'd']);
  console.log('');
  return printResult(q, answer);
}

// ─── Run a full category ──────────────────────────────────────────────────────

async function runCategory(cat, startQ = 1) {
  let score = 0;
  const questions = cat.questions.filter((q) => q.id >= startQ);
  for (let i = 0; i < questions.length; i++) {
    clearScreen();
    printCategory(cat);
    const correct = await runQuestion(cat, questions[i], questions[i].id);
    if (correct) score++;
    if (i < questions.length - 1) {
      await askForKey(chalk.dim('  Press any key for next question… '), [
        'a',
        'b',
        'c',
        'd',
        'return',
        'space',
        'n',
        'right',
      ]);
    }
  }
  clearScreen();
  printScore(score, questions.length);
  return { score, total: questions.length };
}

async function runCategoryReview(cat, startQ = 1) {
  const questions = cat.questions.filter((q) => q.id >= startQ);
  if (questions.length === 0) {
    console.log(chalk.yellow(`  ⚠️  No questions found from #${startQ} in category ${cat.index}.`));
    return { score: 0, total: 0 };
  }

  console.log('');
  console.log(chalk.bold.cyan(`  📚  Category ${cat.index}: ${cat.category}`));
  console.log(chalk.dim(`  ${questions.length} question(s) in review mode`));
  console.log('');

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    printQuestion(cat, q, q.id);
    printReviewResult(q);
  }

  console.log(chalk.bold.green(`  ✅  Review complete for category ${cat.index}.\n`));
  return { score: 0, total: questions.length };
}

// ─── One-shot mode ────────────────────────────────────────────────────────────

async function runOneShot(catArg, qArg) {
  const cats = loadCategories();

  if (!process.stdin.isTTY) {
    console.log(chalk.yellow('  ⚠️  No TTY detected. Switching to review mode.\n'));
    if (catArg == null) {
      let totalQ = 0;
      for (const cat of cats) {
        const { total } = await runCategoryReview(cat);
        totalQ += total;
      }
      console.log(chalk.bold.cyan(`  📘  Review completed: ${totalQ} question(s).\n`));
      return;
    }

    const cat = cats.find((c) => c.index === catArg);
    if (!cat) {
      console.error(chalk.red(`  ❌  Category ${catArg} not found. Available: 1-${cats.length}`));
      process.exit(1);
    }
    await runCategoryReview(cat, qArg || 1);
    return;
  }

  if (catArg == null) {
    // run all categories
    let totalScore = 0,
      totalQ = 0;
    for (const cat of cats) {
      const { score, total } = await runCategory(cat);
      totalScore += score;
      totalQ += total;
    }
    clearScreen();
    printScore(totalScore, totalQ);
    return;
  }
  const cat = cats.find((c) => c.index === catArg);
  if (!cat) {
    console.error(chalk.red(`  ❌  Category ${catArg} not found. Available: 1-${cats.length}`));
    process.exit(1);
  }
  await runCategory(cat, qArg || 1);
}

// ─── Interactive mode ─────────────────────────────────────────────────────────

async function runInteractive() {
  if (!process.stdin.isTTY) {
    console.error(chalk.red('  ❌  Interactive mode requires a TTY terminal.'));
    process.exit(1);
  }
  const cats = loadCategories();
  const rl = createRl();

  while (true) {
    clearScreen();
    console.log(chalk.bold.cyan('\n  🎓  TypeScript Fundamentals — QCM\n'));
    cats.forEach((c) => {
      console.log(
        chalk.cyan(`  [${c.index}]`) +
          `  ${c.category}` +
          chalk.dim(` (${c.questions.length} questions)`),
      );
    });
    console.log(chalk.dim('\n  [a]  All categories'));
    console.log(chalk.dim('  [q]  Quit\n'));

    const input = (await ask(rl, chalk.cyan('  Choose a category (number, a, or q): ')))
      .trim()
      .toLowerCase();

    if (input === 'q') {
      console.log(chalk.green('\n  👋  See you next time!\n'));
      break;
    }

    if (input === 'a') {
      rl.close();
      await runOneShot(null, null);
      return;
    }

    const num = parseInt(input, 10);
    if (isNaN(num) || !cats.find((c) => c.index === num)) {
      console.log(chalk.red(`  ❌  Invalid choice.`));
      await new Promise((r) => setTimeout(r, 800));
      continue;
    }

    rl.close();
    await runOneShot(num, null);

    // Re-open rl for next iteration
    const { createInterface } = readline;
    readline.createInterface = createInterface;
    return; // restart by re-running the script flow
  }

  rl.close();
}

// ─── Entry point ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isInteractive = args.includes('--interactive');
const numArgs = args.filter((a) => !a.startsWith('--'));

if (isInteractive) {
  runInteractive().catch((e) => {
    console.error(chalk.red(e.message));
    process.exit(1);
  });
} else if (numArgs.length === 0) {
  runOneShot(null, null).catch((e) => {
    console.error(chalk.red(e.message));
    process.exit(1);
  });
} else {
  const parts = numArgs[0].split('-').map(Number);
  runOneShot(parts[0] || null, parts[1] || null).catch((e) => {
    console.error(chalk.red(e.message));
    process.exit(1);
  });
}
