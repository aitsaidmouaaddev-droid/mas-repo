module.exports = {
  displayName: 'theme',
  testEnvironment: 'jsdom',
  rootDir: '../../../',
  roots: ['<rootDir>/libs/shared/theme'],
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
          lib: ['es2022', 'dom'],
        },
      },
    ],
  },
};
