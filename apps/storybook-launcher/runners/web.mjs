import { spawn } from 'child_process';
import path from 'path';

const FRAMEWORK_PORT = {
  react: '6006',
  angular: '6007',
  vue: '6008',
  svelte: '6009',
};

export async function runWeb(target, _monorepoRoot) {
  const configDir = path.join(target.root, '.storybook');
  const port = FRAMEWORK_PORT[target.framework] ?? '6006';

  console.log(
    `\nLaunching Storybook for ${target.name} (${target.framework}) on port ${port}...\n`,
  );

  const child = spawn(
    'npx',
    ['storybook', 'dev', '--config-dir', configDir, '--port', port],
    {
      cwd: target.root,
      stdio: 'inherit',
      shell: true,
    },
  );

  child.on('exit', (code) => process.exit(code ?? 0));
}
