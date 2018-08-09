const { join } = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production'
    ? 'production'
    : 'development',
  devServer: {
    contentBase: join(__dirname, './docs'),
    port: 8080
  },
  output: {
    path: join(__dirname, './docs'),
    filename: 'markwright.bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [],
  entry: './src/example/index.tsx',
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
