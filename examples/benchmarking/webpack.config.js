/* eslint-env node */

const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const context = path.join(__dirname, 'src')

/**
 * Any file in the root of the examples src is considered a new example and a new HTML page and entry point.
 */
const examples = fs
  .readdirSync(context)
  .filter((source) => source.endsWith('.tsx'))
  .map((fileName) => {
    const chunkId = path.parse(fileName).name

    return {
      entry: {
        [chunkId]: `./${fileName}`,
      },
      plugin: new HtmlWebpackPlugin({
        filename: `${chunkId}.html`,
        title: 'Ore UI - Example',
        chunks: [chunkId],
      }),
    }
  })

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  context,

  performance: {
    hints: false,
  },

  entry: examples.map(({ entry }) => entry).reduce((acc, current) => ({ ...acc, ...current }), {}),

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  // devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : undefined,

  plugins: examples.map(({ plugin }) => plugin),
}
