const baseConfig = require('../../../jest.base.config')
const projectName = require('./package.json').name

module.exports = {
  ...baseConfig,
  name: projectName,
  displayName: projectName,
  rootDir: './',
}
