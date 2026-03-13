'use strict';
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const markerRe = /^\s*\/\/\s*(?:─+\s*)?Exercise\s+(\d+)\s+—\s+(.*)$/;

function cleanTitle(title) {
  return title.replace(/\s+─+\s*$/, '').trim();
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.endsWith('.solution.js')) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function parseExerciseBlocks(fileText) {
  const lines = fileText.split('\n');
  const starts = [];

  for (let i = 0; i < lines.length; i++) {
    const match = markerRe.exec(lines[i]);
    if (match) {
      starts.push({
        index: i,
        exerciseNumber: Number(match[1]),
        title: cleanTitle(match[2]),
      });
    }
  }

  return starts.map((start, idx) => {
    const end = idx + 1 < starts.length ? starts[idx + 1].index : lines.length;
    const content = lines.slice(start.index, end).join('\n').trimEnd();
    const links = Array.from(new Set(content.match(/https?:\/\/\S+/g) || []));
    return {
      exerciseNumber: start.exerciseNumber,
      title: start.title,
      content,
      links,
    };
  });
}

let generated = 0;

for (const solutionJsPath of walk(srcDir)) {
  const fileText = fs.readFileSync(solutionJsPath, 'utf8');
  const relativePath = path.relative(srcDir, solutionJsPath).replace(/\\/g, '/');
  const outputPath = solutionJsPath.replace(/\.solution\.js$/, '.solution.json');
  const payload = {
    version: 1,
    sourceFile: relativePath,
    generatedAt: new Date().toISOString(),
    exercises: parseExerciseBlocks(fileText),
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  generated++;
  console.log(`generated ${path.relative(srcDir, outputPath).replace(/\\/g, '/')}`);
}

console.log(`\nTotal generated: ${generated}`);
