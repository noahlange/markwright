const { resolve } = require('path');
const externals = require('webpack-node-externals');

module.exports = {
  mode: process.env.NODE_ENV === 'production'
    ? 'production'
    : 'development',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'markwright.js',
    library: 'markwright',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  externals: [externals()],
  plugins: [],
  entry: './src/markwright/index.tsx',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.tsx?/,
        exclude: [],
        use: ['ts-loader']
      }
    ]
  }
};
