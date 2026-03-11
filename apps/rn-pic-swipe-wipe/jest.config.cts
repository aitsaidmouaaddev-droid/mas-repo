/// <reference types="jest" />
/// <reference types="node" />
module.exports = {
  displayName: '@mas/rn-pic-swipe-wipe',
  preset: 'jest-expo',
  verbose: true,
  rootDir: '../../',
  roots: ['<rootDir>/apps/rn-pic-swipe-wipe'],
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  setupFilesAfterEnv: [
    '<rootDir>/apps/rn-pic-swipe-wipe/jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@expo/vector-icons)',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    '\.svg$': '@nx/expo/plugins/jest/svg-mock',
    // expo/virtual/env: babel-preset-expo transforms process.env.EXPO_PUBLIC_* to this
    '^expo/virtual/env$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-virtual-env.js',
    // expo/src/winter and expo/virtual/*: Expo winter runtime — Node.js already has these globals
    '^expo/src/winter$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
    '^expo/src/winter/(.+)$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
    '^expo/virtual/(.*)$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
    '^@mas/rn/ui$': '<rootDir>/libs/react-native/ui/src/index.ts',
    '^@mas/rn/ui/(.*)$': '<rootDir>/libs/react-native/ui/src/$1',
    '^@mas/shared/store$': '<rootDir>/libs/shared/store/src/index.ts',
    '^@mas/rn/database$': '<rootDir>/libs/react-native/database/src/index.ts',
    '^@mas/rn/database/(.*)$': '<rootDir>/libs/react-native/database/src/$1',
    '^@mas/rn/media$': '<rootDir>/libs/react-native/media/src/index.ts',
    '^@mas/shared/types$': '<rootDir>/libs/shared/types/src/index.ts',
    '^@mas/shared/types/(.*)$': '<rootDir>/libs/shared/types/src/$1',
    '^@components/(.*)$': '<rootDir>/apps/rn-pic-swipe-wipe/app/components/$1',
    '^@mocks/(.*)$': '<rootDir>/apps/rn-pic-swipe-wipe/mocks/$1',
    '^@styles/(.*)$': '<rootDir>/apps/rn-pic-swipe-wipe/styles/$1',
  },
  transform: {
    '\.[jt]sx?$': [
      'babel-jest',
      {
        configFile: require('path').join(__dirname, '.babelrc.js'),
      },
    ],
    '^.+\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp|ttf|otf|m4v|mov|mp4|mpeg|mpg|webm|aac|aiff|caf|m4a|mp3|wav|html|pdf|obj)$':
      require.resolve('jest-expo/src/preset/assetFileTransformer.js'),
  },
  coverageDirectory: '<rootDir>/coverage/apps/rn-pic-swipe-wipe',
};
