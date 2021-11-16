const path = require('path');
const webpack = require('webpack');
const webpackbar = require('webpackbar');
const { ROOT_PATH } = require('./utils/index');
const data = require('dotenv').config().parsed || {};

const {
  REACT_APP_AGORA_APP_ID = '',
  REACT_APP_AGORA_APP_SDK_DOMAIN = '',
  REACT_APP_AGORA_APP_CERTIFICATE = '',
  REACT_APP_AGORA_APP_RECORD_URL = '',
} = data;

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '*.jsx'],
    alias: {
      src: path.resolve(ROOT_PATH, './src'),
      '@': path.resolve(ROOT_PATH, './src'),
      '~ui-kit': path.resolve(ROOT_PATH, '../agora-meeting-ui/src'),
      '~components': path.resolve(
        ROOT_PATH,
        '../agora-meeting-ui/src/components',
      ),
      '~utilities': path.resolve(
        ROOT_PATH,
        '../agora-meeting-ui/src/utilities',
      ),
    },
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    debug: false,
                    corejs: {
                      version: 3,
                      proposals: true,
                    },
                  },
                ],
                [
                  '@babel/preset-react',
                  {
                    runtime: 'automatic',
                  },
                ],
              ],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    legacy: true,
                  },
                ],
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    loose: true,
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    debug: false,
                    corejs: {
                      version: 3,
                      proposals: true,
                    },
                  },
                ],
                [
                  '@babel/preset-react',
                  {
                    runtime: 'automatic',
                  },
                ],
                '@babel/preset-typescript',
              ],
              plugins: [
                [
                  '@babel/plugin-transform-typescript',
                  {
                    allowDeclareFields: true,
                  },
                ],
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    legacy: true,
                  },
                ],
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    loose: true,
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
    ],
  },
  plugins: [
    new webpackbar(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      REACT_APP_AGORA_APP_ID: JSON.stringify(REACT_APP_AGORA_APP_ID),
      REACT_APP_AGORA_APP_SDK_DOMAIN: JSON.stringify(
        REACT_APP_AGORA_APP_SDK_DOMAIN,
      ),
      REACT_APP_AGORA_APP_CERTIFICATE: JSON.stringify(
        REACT_APP_AGORA_APP_CERTIFICATE,
      ),
      REACT_APP_AGORA_APP_RECORD_URL: JSON.stringify(
        REACT_APP_AGORA_APP_RECORD_URL,
      ),
    }),
  ],
};
