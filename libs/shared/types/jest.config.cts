/// <reference types="jest" />
/// <reference types="node" />
module.exports = {
  displayName: '@mas/shared-types',
  testEnvironment: 'node',
  rootDir: '../../../',
  roots: ['<rootDir>/libs/shared/types'],
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
  coverageDirectory: '<rootDir>/coverage/libs/shared/types',
};
