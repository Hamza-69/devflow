import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import unicorn from 'eslint-plugin-unicorn'
import importPlugin from 'eslint-plugin-import'
import nodePlugin from 'eslint-plugin-n'
import prettier from 'eslint-plugin-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  allConfig: js.configs.all,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  {
    ignores: ['.next/', 'node_modules/'],
  },
  // Base config
  js.configs.recommended,
  // Legacy-compatible configs
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      unicorn,
      n: nodePlugin,
      prettier,
    },
    rules: {
      // Base rules
      'no-console': 'warn',
      'no-unused-vars': 'off', // Turn off base rule as it can report incorrect errors

      // TypeScript rules
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': 'allow-with-description' },
      ],

      // Import rules
      ...importPlugin.configs.recommended.rules,

      // Unicorn rules
      ...unicorn.configs.recommended.rules,
      'unicorn/prevent-abbreviations': 'off',

      // Node rules
      ...nodePlugin.configs['flat/recommended'].rules,

      // Next.js rules
      '@next/next/no-assign-module-variable': 'off',

      // Style rules
      semi: ['error', 'never'],
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
          jsxSingleQuote: true,
        },
      ],
      'comma-dangle': ['error', 'never'],

      // Prettier integration
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          tabWidth: 2,
          useTabs: false,
          trailingComma: 'none',
          printWidth: 80,
          bracketSpacing: true,
          arrowParens: 'always',
        },
      ],
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
]

export default eslintConfig
