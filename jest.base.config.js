/* eslint-env node */

// Base Jest configuration for individual projects. Use this as a starting point for your package config
module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { url: 'http://localhost' },
  watchPathIgnorePatterns: ['<rootDir>/dist/'],
  moduleFileExtensions: ['tsx', 'js', 'ts'],
  testMatch: ['**/?(*.)+(spec|test).js?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/../../../jest.setupTestFrameworkScriptFile.js'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}
