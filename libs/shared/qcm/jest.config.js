module.exports = {
  displayName: 'qcm',
  testEnvironment: 'node',
  rootDir: '../../../',
  roots: ['<rootDir>/libs/shared/qcm'],
  moduleFileExtensions: ['ts', 'js'],
  // Nx generates ESM sources with explicit .js import extensions (e.g. import from './foo.js').
  // Strip the extension so Jest resolves to the .ts source file in CommonJS mode.
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
        },
      },
    ],
  },
  coverageDirectory: '<rootDir>/coverage/libs/shared/qcm',
};
