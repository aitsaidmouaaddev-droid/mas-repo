const chalk = require('chalk');
const { banner, runCommand } = require('./utils');
const { runFlow } = require('./flow');

async function main() {
  banner();
  const { cmd, extraEnv } = await runFlow();
  await runCommand(cmd, extraEnv);
}

main().catch((err) => {
  console.error(chalk.red('\n💥  Unexpected error:'), err);
  process.exit(1);
});
