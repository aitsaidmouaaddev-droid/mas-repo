/**
 * Integration test config — runs against a real PostgreSQL database.
 *
 * Requires DATABASE_URL in the environment (or a .env file at the repo root).
 *
 * Run:
 *   node node_modules/jest/bin/jest.js --config libs/nest/auth/jest.integration.config.js --runInBand
 */
module.exports = {
  displayName: 'auth-integration',
  testEnvironment: 'node',
  rootDir: '../../../',
  roots: ['<rootDir>/libs/nest/auth/test/integration'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
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
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
        },
      },
    ],
  },
  testTimeout: 30000,
  coverageDirectory: '<rootDir>/coverage/libs/nest/auth-integration',
};
