const fs = require('fs');

const moduleUrlMap = {
  'b2000000-0000-4000-8000-000000000001': 'https://en.wikipedia.org/wiki/Data_structure',
  'b2000000-0000-4000-8000-000000000002': 'https://en.wikipedia.org/wiki/Sorting_algorithm',
  'b2000000-0000-4000-8000-000000000003': 'https://en.wikipedia.org/wiki/Backtracking',
  'b2000000-0000-4000-8000-000000000004': 'https://en.wikipedia.org/wiki/Dynamic_programming',
  'b2000000-0000-4000-8000-000000000005': 'https://en.wikipedia.org/wiki/Graph_traversal',
  'd4000000-0000-4000-8000-000000000001': 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
  'd4000000-0000-4000-8000-000000000002': 'https://nodejs.org/api/modules.html',
  'd4000000-0000-4000-8000-000000000003': 'https://nodejs.org/api/fs.html',
  'd4000000-0000-4000-8000-000000000004': 'https://nodejs.org/en/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks',
  'd4000000-0000-4000-8000-000000000005': 'https://expressjs.com/en/starter/hello-world.html',
  'd4000000-0000-4000-8000-000000000006': 'https://nodejs.org/en/learn/getting-started/security-best-practices',
  'd4000000-0000-4000-8000-000000000007': 'https://node-postgres.com/',
  'd4000000-0000-4000-8000-000000000008': 'https://jestjs.io/docs/getting-started',
  'd4000000-0000-4000-8000-000000000009': 'https://nodejs.org/api/cluster.html',
  'd4000000-0000-4000-8000-00000000000a': 'https://nodejs.org/api/http.html',
  'd4000000-0000-4000-8000-00000000000b': 'https://docs.docker.com/guides/nodejs/containerize/',
  'd4000000-0000-4000-8000-00000000000c': 'https://nodejs.org/en/blog/release/v22.0.0',
  'e5000000-0000-4000-8000-000000000001': 'https://docs.nestjs.com/first-steps',
  'e5000000-0000-4000-8000-000000000002': 'https://docs.nestjs.com/providers',
  'e5000000-0000-4000-8000-000000000003': 'https://docs.nestjs.com/pipes',
  'e5000000-0000-4000-8000-000000000004': 'https://docs.nestjs.com/middleware',
  'e5000000-0000-4000-8000-000000000005': 'https://docs.nestjs.com/controllers',
  'e5000000-0000-4000-8000-000000000006': 'https://docs.nestjs.com/graphql/quick-start',
  'e5000000-0000-4000-8000-000000000007': 'https://docs.nestjs.com/security/authentication',
  'e5000000-0000-4000-8000-000000000008': 'https://docs.nestjs.com/techniques/database',
  'e5000000-0000-4000-8000-000000000009': 'https://docs.nestjs.com/microservices/basics',
  'e5000000-0000-4000-8000-00000000000a': 'https://docs.nestjs.com/fundamentals/testing',
  'e5000000-0000-4000-8000-00000000000b': 'https://docs.nestjs.com/techniques/configuration',
  'f6000000-0000-4000-8000-000000000001': 'https://www.postgresql.org/docs/current/tutorial-sql.html',
  'f6000000-0000-4000-8000-000000000002': 'https://www.postgresql.org/docs/current/queries-select-lists.html',
  'f6000000-0000-4000-8000-000000000003': 'https://www.postgresql.org/docs/current/queries-table-expressions.html',
  'f6000000-0000-4000-8000-000000000004': 'https://www.postgresql.org/docs/current/queries-with.html',
  'f6000000-0000-4000-8000-000000000005': 'https://www.postgresql.org/docs/current/tutorial-window.html',
  'f6000000-0000-4000-8000-000000000006': 'https://www.postgresql.org/docs/current/indexes.html',
  'f6000000-0000-4000-8000-000000000007': 'https://www.postgresql.org/docs/current/tutorial-transactions.html',
  'f6000000-0000-4000-8000-000000000008': 'https://www.postgresql.org/docs/current/ddl.html',
  'f6000000-0000-4000-8000-000000000009': 'https://www.postgresql.org/docs/current/functions-json.html',
  'f6000000-0000-4000-8000-00000000000a': 'https://www.postgresql.org/docs/current/ddl-alter.html',
};

const files = [
  'C:\\Users\\aitsa\\Projects\\mas-repo\\apps\\react-fundamentals\\migrations\\1773962100000-AddAlgorithmesQuestions.ts',
  'C:\\Users\\aitsa\\Projects\\mas-repo\\apps\\react-fundamentals\\migrations\\1773962300000-AddNodeJsQuestions.ts',
  'C:\\Users\\aitsa\\Projects\\mas-repo\\apps\\react-fundamentals\\migrations\\1773962301000-AddNodeJsQuestions2.ts',
  'C:\\Users\\aitsa\\Projects\\mas-repo\\apps\\react-fundamentals\\migrations\\1773962400000-AddNestJsQuestions.ts',
  'C:\\Users\\aitsa\\Projects\\mas-repo\\apps\\react-fundamentals\\migrations\\1773962401000-AddNestJsQuestions2.ts',
  'C:\\Users\\aitsa\\Projects\\mas-repo\\apps\\react-fundamentals\\migrations\\1773962500000-AddSqlQuestions.ts',
  'C:\\Users\\aitsa\\Projects\\mas-repo\\apps\\react-fundamentals\\migrations\\1773962501000-AddSqlQuestions2.ts',
];

let totalModified = 0;
let totalSkipped = 0;

for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const newLines = [];
  let modified = 0;
  let skipped = 0;

  for (const line of lines) {
    const moduleMatch = line.match(/moduleId: '([^']+)'/);
    if (!moduleMatch) {
      newLines.push(line);
      continue;
    }

    const moduleId = moduleMatch[1];
    const url = moduleUrlMap[moduleId];

    if (!url) {
      skipped++;
      newLines.push(line);
      continue;
    }

    if (line.includes('docs:')) {
      newLines.push(line);
      continue;
    }

    // Replace ' } }, at end of line with ', docs: 'URL' } },
    const newLine = line.replace(/'\s*\}\s*\},\s*$/, `', docs: '${url}' } },`);

    if (newLine !== line) {
      modified++;
    }

    newLines.push(newLine);
  }

  const newContent = newLines.join('\n');

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    const fileName = filePath.split('\\').pop();
    console.log(`${fileName}: ${modified} lines modified, ${skipped} skipped`);
    totalModified += modified;
    totalSkipped += skipped;
  }
}

console.log(`\nTotal: ${totalModified} modified, ${totalSkipped} skipped (no URL mapping)`);
