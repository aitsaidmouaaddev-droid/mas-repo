module.exports = {
  displayName: 'db-typeorm',
  testEnvironment: 'node',
  rootDir: '../../../',
  roots: ['<rootDir>/libs/nest/db-typeorm'],
  moduleFileExtensions: ['ts', 'js'],
  // Strip .js extensions so Jest resolves to .ts source files in CommonJS mode.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@mas/db-contracts$': '<rootDir>/libs/nest/db-contracts/src/index.ts',
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
  coverageDirectory: '<rootDir>/coverage/libs/nest/db-typeorm',
};
