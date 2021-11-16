const path = require('path');
var webpack = require('webpack');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.CVA_PORT = process.env.CVA_PORT || 9000;

const config = function (mode) {
  let conf = {
    mode: mode,
    entry: ['./src/index.js'],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.html$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'html-loader',
            options: {},
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    output: {
      filename: 'bundle.js',
      publicPath: '/',
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    devServer: {
      open: true,
      compress: true,
      port: process.env.CVA_PORT,
    },
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      },
    },
  };
  return conf;
};

module.exports = config(process.env.NODE_ENV);
