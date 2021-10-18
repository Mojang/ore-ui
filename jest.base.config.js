/* eslint-env node */

// Base Jest configuration for individual projects. Use this as a starting point for your package config
module.exports = {
  watchPathIgnorePatterns: ['<rootDir>/dist/'],
  testResultsProcessor: '<rootDir>/../../../jest.testResultsProcessor.js',
  moduleFileExtensions: ['tsx', 'js', 'ts'],
  testMatch: ['**/?(*.)+(spec|test).js?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/../../../jest.setupTestFrameworkScriptFile.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'babel-jest',
  },
}
