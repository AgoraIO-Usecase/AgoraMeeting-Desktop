/**
 *  production
 */
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ROOT_PATH, PUBLIC_PATH, SRC_PATH } = require('./utils/index');
const path = require('path');

const config = {
  mode: 'production',
  entry: path.resolve(SRC_PATH, './index.tsx'),
  output: {
    path: path.resolve(ROOT_PATH, './build'),
    publicPath: './',
    filename: 'static/bundle-[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                config: path.resolve(ROOT_PATH, './postcss.config.js'),
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2|eot|ttf)$/,
        type: 'asset',
        generator: {
          filename: 'static/assets/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/[name].[contenthash].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(ROOT_PATH, './public'),
          to: path.resolve(ROOT_PATH, './build'),
          globOptions: {
            ignore: ['**/index.html'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(PUBLIC_PATH, './index.html'),
      inject: true,
    }),
  ],
};

const mergedConfig = webpackMerge.merge(baseConfig, config);

module.exports = mergedConfig;
