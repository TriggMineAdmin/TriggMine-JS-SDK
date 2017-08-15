var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  devtool: 'source-map',
  output: {
    filename: 'triggmine.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
};