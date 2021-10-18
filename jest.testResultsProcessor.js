/* eslint-env node */

const { compose } = require('ramda')

// run both custom reports
module.exports = compose(require('jest-junit-reporter'), require('jest-sonar-reporter'))
