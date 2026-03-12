module.exports = {
  displayName: '@mas/frontend-dal',
  testEnvironment: 'node',
  rootDir: '../../../',
  roots: ['<rootDir>/libs/shared/frontend-dal'],
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
  coverageDirectory: '<rootDir>/coverage/libs/shared/frontend-dal',
};
