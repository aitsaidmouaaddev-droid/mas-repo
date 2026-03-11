/// <reference types="jest" />
/// <reference types="node" />
module.exports = {
  displayName: '@mas/shared/store',
  testEnvironment: 'node',
  rootDir: '../../../',
  roots: ['<rootDir>/libs/shared/store'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'node',
          strict: true,
          skipLibCheck: true,
        },
      },
    ],
  },
  coverageDirectory: '<rootDir>/coverage/libs/shared/store',
};
