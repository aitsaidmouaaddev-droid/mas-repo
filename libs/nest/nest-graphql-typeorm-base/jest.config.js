module.exports = {
  displayName: 'nest-graphql-typeorm-base',
  testEnvironment: 'node',
  rootDir: '../../../',
  roots: ['<rootDir>/libs/nest/nest-graphql-typeorm-base'],
  moduleFileExtensions: ['ts', 'js'],
  // Nx generates ESM sources with explicit .js import extensions (e.g. import from './foo.js').
  // Strip the extension so Jest resolves to the .ts source file in CommonJS mode.
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
  coverageDirectory: '<rootDir>/coverage/libs/nest/nest-graphql-typeorm-base',
};
