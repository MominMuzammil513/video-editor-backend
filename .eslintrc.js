// .eslintrc.js
module.exports = {
    env: {
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:import/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import/order': ['error', { 'newlines-between': 'always' }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  };
  