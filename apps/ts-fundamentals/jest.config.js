module.exports = {
  displayName: 'ts-fundamentals',
  testEnvironment: 'node',
  rootDir: '../../',
  roots: ['<rootDir>/apps/ts-fundamentals/src/coding'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: { '^(\.{1,2}/.*)\.js$': '$1' },
  transform: {
    '^.+\.ts$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'node',
          strict: true,
          skipLibCheck: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          noUnusedLocals: false,
          target: 'ES2022',
        },
      },
    ],
  },
  coverageDirectory: '<rootDir>/apps/ts-fundamentals/coverage',
};
