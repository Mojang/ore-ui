/* eslint-env node */

// Jest configuration for monorepo-wide test runner
module.exports = {
  projects: ['<rootDir>/packages/@react-facet/*/jest.config.js', '<rootDir>/packages/@ore-ui/*/jest.config.js'],
  coverageReporters: ['html', 'text', 'cobertura', 'lcov'],
  coveragePathIgnorePatterns: ['/node_modules/'],
}
