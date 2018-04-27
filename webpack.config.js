const { resolve } = require('path');
const { DefinePlugin, NamedModulesPlugin, IgnorePlugin } = require('webpack');
const externals = require('webpack-node-externals');
const Minify = require('babel-minify-webpack-plugin');

module.exports = [
  {
    output: {
      path: __dirname,
      filename: 'markwright.js',
      library: 'markwright',
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    externals: [externals()],
    plugins: [
      new NamedModulesPlugin(),
      new Minify({ removeConsole: true }, { comments: false, topLevel: true })
    ],
    entry: './src/markwright/index.tsx',
    target: 'web',
    module: {
      rules: [
        {
          test: /\.tsx?/,
          exclude: [],
          use: ['awesome-typescript-loader']
        }
      ]
    }
  },
  {
    output: {
      path: resolve(__dirname, 'docs'),
      filename: 'markwright.bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new Minify({ removeConsole: true }, { comments: false, topLevel: true }),
      new IgnorePlugin(/.css$/)
    ],
    entry: './src/example/index.tsx',
    target: 'web',
    module: {
      rules: [
        {
          test: /\.tsx?/,
          exclude: [],
          use: ['awesome-typescript-loader']
        }
      ]
    }
  }
];
