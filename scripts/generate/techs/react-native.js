const prompts = require('prompts');
const { onCancel, section } = require('../utils');

// React Native only supports "app" in Nx (via @nx/expo or @nx/react-native)
async function askReactNative() {
  section('React Native app options');

  return await prompts(
    [
      {
        type: 'select',
        name: 'framework',
        message: '📱  Framework',
        choices: [
          { title: 'Expo (recommended)', value: 'expo' },
          { title: 'Bare React Native', value: 'react-native' },
        ],
        initial: 0,
      },
      {
        type: 'text',
        name: 'displayName',
        message: '📛  App display name (shown on device)',
        initial: '',
      },
      {
        type: 'select',
        name: 'unitTestRunner',
        message: '🧪  Unit test runner',
        choices: [
          { title: 'Jest', value: 'jest' },
          { title: 'None', value: 'none' },
        ],
        initial: 0,
      },
      {
        type: 'select',
        name: 'e2eTestRunner',
        message: '🔍  E2E test runner',
        choices: [
          { title: 'Detox', value: 'detox' },
          { title: 'None', value: 'none' },
        ],
        initial: 1,
      },
    ],
    { onCancel },
  );
}

module.exports = { askReactNative };
