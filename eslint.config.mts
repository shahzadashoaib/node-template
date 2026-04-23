import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  js.configs.recommended,
  prettierConfig,

  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      prettier,
      'unused-imports': unusedImports,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',

      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  ...tseslint.configs.recommended,
]);
