var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/main/js/index',
  output: {
    path:  path.resolve(__dirname, 'src/main/resources/scheduler/assets/js'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: [ '.js' ]
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loaders: ['babel-loader'],
      include: path.resolve(__dirname, 'src/main/js')
    }]
  }
};
