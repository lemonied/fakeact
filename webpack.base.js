const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./example/index.tsx",
  output: {
    path: resolve(__dirname, './dist'),
    filename: '[id]-[fullhash].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
  module: {
    rules: [{
      test: /\.(jsx?|tsx?)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './example/index.html')
    }),
  ],
};
