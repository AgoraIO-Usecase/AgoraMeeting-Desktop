/**
 *  development
 */
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {
  ROOT_PATH,
  DEFAULT_PORT,
  PUBLIC_PATH,
  SRC_PATH,
} = require('./utils/index');
const path = require('path');


const config = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.resolve(SRC_PATH, './index.tsx'),
  output: {
    publicPath: '/',
    filename: 'bundle-[contenthash].js',
  },
  devServer: {
    port: DEFAULT_PORT,
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
        type: 'asset',
        generator: {
          filename: 'static/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(PUBLIC_PATH, '/**/*'),
    //       to: ROOT_PATH,
    //       globOptions: {
    //         ignore: ['**/index.html'],
    //       },
    //       noErrorOnMissing: true,
    //     },
    //   ],
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(PUBLIC_PATH, './index.html'),
      inject: true,
    }),
  ],
};

const mergedConfig = webpackMerge.merge(baseConfig, config);

module.exports = mergedConfig;
