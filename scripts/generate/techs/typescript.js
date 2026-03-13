const { section } = require('../utils');

async function askTypeScript() {
  section('TypeScript app options');

  return {
    framework: 'none',
    bundler: 'esbuild',
    linter: 'eslint',
    unitTestRunner: 'jest',
    e2eTestRunner: 'none',
    docker: false,
    js: false,
  };
}

module.exports = { askTypeScript };
