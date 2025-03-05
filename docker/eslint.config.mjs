import cheminfo from 'eslint-config-cheminfo-typescript';
import globals from 'globals';

export default [
  ...cheminfo,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-await-in-loop': 'off',
    },
  },
  {
    files: ['**/__tests__/**/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
];
