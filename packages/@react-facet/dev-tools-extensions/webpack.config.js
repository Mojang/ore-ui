const path = require('path');

module.exports = {
  entry: {
    index: './src/index.tsx',
    injectGlobalHook: './src/injectGlobalHook.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'chrome', 'dist'),
  },
};
