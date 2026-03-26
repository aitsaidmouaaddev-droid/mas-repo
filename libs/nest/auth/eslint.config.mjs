import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: ['**/out-tsc'],
  },
  {
    // NestJS DI requires value imports for emitDecoratorMetadata — demote to warn
    rules: {
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
];
