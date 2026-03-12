module.exports = {
  displayName: '@mas/rn-media',
  preset: 'jest-expo',
  verbose: true,
  rootDir: '../../../',
  roots: ['<rootDir>/libs/react-native/media'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@expo/vector-icons)',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.svg$': '@nx/expo/plugins/jest/svg-mock',
    '^expo/virtual/env$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-virtual-env.js',
    '^expo/src/winter$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
    '^expo/src/winter/(.+)$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
    '^expo/virtual/(.*)$': '<rootDir>/apps/rn-pic-swipe-wipe/__mocks__/expo-winter.js',
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
  coverageDirectory: '<rootDir>/coverage/libs/react-native/media',
};
