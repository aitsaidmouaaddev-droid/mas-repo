/// <reference types="jest" />
/// <reference types="node" />
module.exports = {
  displayName: '@mas/mas-sqlite',
  testEnvironment: 'node',
  rootDir: '../../../',
  roots: ['<rootDir>/libs/shared/mas-sqlite'],
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
  coverageDirectory: '<rootDir>/coverage/libs/shared/mas-sqlite',
};
