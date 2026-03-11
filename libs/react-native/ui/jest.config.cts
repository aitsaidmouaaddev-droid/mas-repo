/// <reference types="jest" />
/// <reference types="node" />
module.exports = {
  displayName: '@mas/rn-ui',
  preset: 'jest-expo',
  verbose: true,
  rootDir: '../../../',
  roots: ['<rootDir>/libs/react-native/ui'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/libs/react-native/ui/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@expo/vector-icons)',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.svg$': '@nx/expo/plugins/jest/svg-mock',
    '^react-native/Libraries/Animated/NativeAnimatedHelper$':
      '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
    '^expo/virtual/env$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-virtual-env.js',
    '^expo/src/winter$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
    '^expo/src/winter/(.+)$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
    '^expo/virtual/(.*)$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
    '^@mas/rn/ui$': '<rootDir>/libs/react-native/ui/src/index.ts',
    '^@mas/rn/ui/(.*)$': '<rootDir>/libs/react-native/ui/src/$1',
    '^@mas/shared/types$': '<rootDir>/libs/shared/types/src/index.ts',
    '^@mas/shared/types/(.*)$': '<rootDir>/libs/shared/types/src/$1',
  },
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        configFile: require('path').join(__dirname, '.babelrc.js'),
      },
    ],
    '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp|ttf|otf|m4v|mov|mpeg|mpg|webm|aac|aiff|caf|m4a|mp3|wav|html|pdf|obj)$':
      require.resolve('jest-expo/src/preset/assetFileTransformer.js'),
  },
  coverageDirectory: '<rootDir>/coverage/libs/react-native/ui',
};
