import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginReact from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true, jsxRuntime: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react: pluginReact, // Register the plugin
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_|React' }],
      ...pluginReact.configs.recommended.rules, // Apply recommended rules from react plugin
      'react/prop-types': 'off', // Explicitly disable prop-types after recommended rules
      'react/react-in-jsx-scope': 'off', // Turn off for new JSX transform
      'react/jsx-uses-react': 'off', // Turn off for new JSX transform
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])
