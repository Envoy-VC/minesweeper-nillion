module.exports = {
  ignorePatterns: ['apps/**', 'packages/**'],
  extends: ['./packages/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
