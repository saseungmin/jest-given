module.exports = {
  root: true,
  env: {
    es6: true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
    'lib/',
  ],
  extends: [
    'airbnb-base',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
      ],
      plugins: [
        '@typescript-eslint',
      ],
      rules: {
        // set your typescript rules
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
  rules: {
    'no-underscore-dangle': 'off',
  },
};
