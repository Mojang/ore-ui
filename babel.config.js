/* eslint-env node */

module.exports = function (api) {
  // caches the config for a build run
  api.cache.forever()

  return {
    presets: ['@babel/preset-typescript'],
    plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-transform-react-jsx'],
  }
}
