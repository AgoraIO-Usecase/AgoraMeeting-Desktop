/**
 *  pack npm
 */
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { SRC_PATH, ROOT_PATH } = require('./utils/index');
const path = require('path');

const config = {
  mode: 'production',
  entry: {
    edu_sdk: path.resolve(SRC_PATH, './infra/api/index.tsx'),
  },
  output: {
    publicPath: '',
    filename: '[name].bundle.js',
    libraryTarget: 'umd',
    library: 'AgoraMeetingSDK',
    libraryExport: 'default',
    path: path.resolve(ROOT_PATH, 'lib'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'thread-loader',
          },
          {
            loader: 'style-loader',
          },
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
        type: 'asset/inline',
      },
    ],
  },
  optimization: {
    minimize: true,
    sideEffects: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false, // 删除无用代码时是否给出警告
            drop_debugger: true, // 删除所有的debugger
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin()
  ],
};

const mergedConfig = webpackMerge.merge(baseConfig, config);
module.exports = mergedConfig;
