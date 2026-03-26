const chalk = require('chalk');
const { banner, runCommand } = require('./utils');
const { runFlow } = require('./flow');
const { postProcess } = require('./post-process');

async function main() {
  banner();
  const { cmd, extraEnv, meta } = await runFlow();
  await runCommand(cmd, extraEnv);
  await postProcess(meta);
}

main().catch((err) => {
  console.error(chalk.red('\n💥  Unexpected error:'), err);
  process.exit(1);
});
