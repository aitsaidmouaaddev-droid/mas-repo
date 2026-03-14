/**
 * Interactive coding-test runner for ts-fundamentals.
 *
 * Selectors:
 *   a-b     -> module a, file b
 *   a-b-c   -> module a, file b, test c
 *
 * Examples:
 *   node scripts/solution.js
 *   node scripts/solution.js --interactive
 *   node scripts/solution.js 1-2
 *   node scripts/solution.js 1-2-3
 */

'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');
const chalk = require('chalk');

const appRoot = path.join(__dirname, '..');
const workspaceRoot = path.join(__dirname, '..', '..', '..');
const codingDir = path.join(appRoot, 'src', 'coding');
const jestBin = path.join(workspaceRoot, 'node_modules', 'jest-cli', 'bin', 'jest.js');
const jestConfig = path.join(appRoot, 'jest.config.js');

function clearScreen() {
	if (process.stdout.isTTY) process.stdout.write('\x1Bc');
}

function createRl() {
	return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function ask(rl, prompt) {
	return new Promise((resolve) => rl.question(prompt, resolve));
}

function parseSelector(value) {
	const raw = String(value || '').trim();
	if (!raw) return null;

	const m2 = /^(\d+)-(\d+)$/.exec(raw);
	if (m2) {
		return { moduleIndex: Number(m2[1]), fileIndex: Number(m2[2]), testIndex: null, raw };
	}

	const m3 = /^(\d+)-(\d+)-(\d+)$/.exec(raw);
	if (m3) {
		return {
			moduleIndex: Number(m3[1]),
			fileIndex: Number(m3[2]),
			testIndex: Number(m3[3]),
			raw,
		};
	}

	return null;
}

function listModules() {
	return fs
		.readdirSync(codingDir)
		.filter((name) => /^\d+/.test(name) && fs.statSync(path.join(codingDir, name)).isDirectory())
		.sort();
}

function listTestFiles(moduleName) {
	const moduleDir = path.join(codingDir, moduleName);
	return fs
		.readdirSync(moduleDir)
		.filter((name) => name.endsWith('.test.ts') && /^\d+/.test(name))
		.sort();
}

function parseTestTitles(testFilePath) {
	const source = fs.readFileSync(testFilePath, 'utf8');
	const tests = [];
	const re = /(?:it|test)\(\s*(['"`])([\s\S]*?)\1\s*,/g;

	let match;
	while ((match = re.exec(source)) !== null) {
		const title = String(match[2] || '').replace(/\s+/g, ' ').trim();
		if (title) tests.push(title);
	}

	return tests;
}

function runJest(testFilePath, testNamePattern) {
	const args = [jestBin, '--config', jestConfig, '--runInBand', testFilePath];
	if (testNamePattern) args.push('-t', testNamePattern);

	const result = spawnSync(process.execPath, args, {
		stdio: 'inherit',
		cwd: workspaceRoot,
		env: process.env,
	});

	return result.status == null ? 1 : result.status;
}

function resolveSelector(selector) {
	const modules = listModules();
	const moduleName = modules[selector.moduleIndex - 1];
	if (!moduleName) {
		throw new Error(`Module ${selector.moduleIndex} not found (available: 1-${modules.length}).`);
	}

	const testFiles = listTestFiles(moduleName);
	const testFileName = testFiles[selector.fileIndex - 1];
	if (!testFileName) {
		throw new Error(
			`File ${selector.fileIndex} not found in ${moduleName} (available: 1-${testFiles.length}).`,
		);
	}

	const testFilePath = path.join(codingDir, moduleName, testFileName);
	const tests = parseTestTitles(testFilePath);

	return { moduleName, testFileName, testFilePath, tests };
}

function printHeader(title) {
	console.log('');
	console.log(chalk.bold.cyan(`  ${title}`));
	console.log(chalk.bold.cyan('  --------------------------------------------------'));
}

async function runInteractive() {
	if (!process.stdin.isTTY) {
		console.error(chalk.red('  ❌  Interactive mode requires a TTY terminal.'));
		process.exit(1);
	}

	const modules = listModules();
	const rl = createRl();

	while (true) {
		clearScreen();
		printHeader('TS Fundamentals - Code Play');
		modules.forEach((name, i) => {
			console.log(chalk.cyan(`  [${i + 1}]`) + ` ${name}`);
		});
		console.log(chalk.dim('\n  [q] quit'));

		const moduleInput = (await ask(rl, chalk.cyan('\n  Choose module: '))).trim().toLowerCase();
		if (moduleInput === 'q') break;

		const moduleIdx = Number(moduleInput);
		const moduleName = modules[moduleIdx - 1];
		if (!moduleName) continue;

		const testFiles = listTestFiles(moduleName);

		while (true) {
			clearScreen();
			printHeader(`Module ${moduleIdx}: ${moduleName}`);
			testFiles.forEach((file, i) => {
				console.log(chalk.cyan(`  [${i + 1}]`) + ` ${file.replace(/\.test\.ts$/, '')}`);
			});
			console.log(chalk.dim('\n  [b] back   [q] quit'));

			const fileInput = (await ask(rl, chalk.cyan('\n  Choose file: '))).trim().toLowerCase();
			if (fileInput === 'q') {
				rl.close();
				return;
			}
			if (fileInput === 'b') break;

			const fileIdx = Number(fileInput);
			const fileName = testFiles[fileIdx - 1];
			if (!fileName) continue;

			const testFilePath = path.join(codingDir, moduleName, fileName);
			const tests = parseTestTitles(testFilePath);

			while (true) {
				clearScreen();
				printHeader(`File ${fileIdx}: ${fileName}`);
				console.log(chalk.cyan('  [a]') + ' Run all tests in this file');
				tests.forEach((title, i) => {
					console.log(chalk.cyan(`  [${i + 1}]`) + ` ${title}`);
				});
				console.log(chalk.dim('\n  [b] back   [q] quit'));

				const testInput = (await ask(rl, chalk.cyan('\n  Choose test: '))).trim().toLowerCase();
				if (testInput === 'q') {
					rl.close();
					return;
				}
				if (testInput === 'b') break;

				clearScreen();
				if (testInput === 'a') {
					runJest(testFilePath, null);
				} else {
					const testIdx = Number(testInput);
					const testTitle = tests[testIdx - 1];
					if (!testTitle) continue;
					runJest(testFilePath, testTitle);
				}

				await ask(rl, chalk.dim('\n  Press Enter to continue... '));
			}
		}
	}

	rl.close();
}

function runSelector(selector) {
	const resolved = resolveSelector(selector);

	console.log(chalk.bold.cyan('\n  Running selector:'), chalk.bold.white(` ${selector.raw}`));
	console.log(chalk.dim(`  ${resolved.moduleName}/${resolved.testFileName}\n`));

	if (selector.testIndex == null) {
		process.exitCode = runJest(resolved.testFilePath, null);
		return;
	}

	const testTitle = resolved.tests[selector.testIndex - 1];
	if (!testTitle) {
		throw new Error(
			`Test ${selector.testIndex} not found in ${resolved.testFileName} (available: 1-${resolved.tests.length}).`,
		);
	}

	process.exitCode = runJest(resolved.testFilePath, testTitle);
}

function printUsage() {
	console.log(chalk.bold('\n  Usage'));
	console.log('  node apps/ts-fundamentals/scripts/solution.js');
	console.log('  node apps/ts-fundamentals/scripts/solution.js --interactive');
	console.log('  node apps/ts-fundamentals/scripts/solution.js 1-1');
	console.log('  node apps/ts-fundamentals/scripts/solution.js 1-1-1\n');
}

async function main() {
	const args = process.argv.slice(2);
	const selectorArg = args.find((arg) => !arg.startsWith('--'));
	const isInteractive = args.includes('--interactive');

	if (isInteractive || !selectorArg) {
		await runInteractive();
		return;
	}

	const selector = parseSelector(selectorArg);
	if (!selector) {
		printUsage();
		process.exitCode = 1;
		return;
	}

	runSelector(selector);
}

main().catch((error) => {
	console.error(chalk.red(`\n  ${error.message}\n`));
	process.exitCode = 1;
});

