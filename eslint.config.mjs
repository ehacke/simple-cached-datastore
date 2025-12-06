import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import stdConfig from '@ehacke/eslint-config';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-underscore-dangle': 'off',
      'sort-keys-fix/sort-keys-fix': 'error',
    },
  },
  {
    ignores: ['eslint.config.mjs', 'dist/**/*', 'scratch.*'],
  },
  {
    plugins: {
      '@ehacke/eslint-config': stdConfig,
    },
  },
];
