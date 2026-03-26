import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['src/**/*.js'],
    rules: {
      'no-console': 'off',
      'no-var': 'off',
      'no-empty': 'off',
      eqeqeq: 'off',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-this-alias': 'off',
    },
  },
];
