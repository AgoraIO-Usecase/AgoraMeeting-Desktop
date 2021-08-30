const {
  override,
  addWebpackExternals,
  useBabelRc,
  fixBabelImports,
  addWebpackModuleRule,
  addWebpackPlugin,
  disableEsLint,
  babelInclude,
  babelExclude,
  addBundleVisualizer,
  getBabelLoader,
  addPostcssPlugins,
  addWebpackAlias,
  addDecoratorsLegacy,
  addBabelPresets,
  adjustStyleLoaders,
  removeModuleScopePlugin,
  // addWebpackTarget,
} = require('customize-cra');
const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');
const dayjs = require('dayjs');
const fs = require('fs');

const packageInfo = require('./package.json');

// const swSrcPath = packageInfo.swSrcPath;

function findSWPrecachePlugin(element) {
  return element.constructor.name === 'GenerateSW';
}

function removeSWPrecachePlugin(config) {
  const swPrecachePluginIndex = config.plugins.findIndex(findSWPrecachePlugin);
  if (swPrecachePluginIndex !== -1) {
    config.plugins.splice(swPrecachePluginIndex, 1); // mutates
  }
}

exports.removeSWPrecachePlugin = removeSWPrecachePlugin;
exports.findSWPrecachePlugin = findSWPrecachePlugin;

const dotenv = require('dotenv');
const { DefinePlugin } = require('webpack');
const addWebpackTarget = (target) => (config) => {
  config.target = target;
  return config;
};

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const isElectron = process.env.REACT_APP_RUNTIME_PLATFORM === 'electron';
const { devDependencies } = require('./package.json');

// TODO: You can customize your env
// TODO: 这里你可以定制自己的env
const isProd = process.env.ENV === 'production';

const addStyleLoader = () => (config) => {
  config.module.rules.push({
    test: /\.css$/,
    include: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, '../agora-meeting-ui/src'),
      path.resolve(__dirname, '../../node_modules/rc-notification'),
      path.resolve(__dirname, '../../node_modules/rc-slider'),
    ],
    use: [
      // No need for "css-loader" nor "style-loader"
      // for CRA will later apply them anyways.
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            config: path.resolve(__dirname, './postcss.config.js'),
          },
        },
      },
    ],
  });
  return config;
};

const webWorkerConfig = () => (config) => {
  config.optimization = {
    ...config.optimization,
    noEmitOnErrors: false,
  };
  config.output = {
    ...config.output,
    globalObject: 'this',
  };
  return config;
};

const sourceMap = () => (config) => {
  // TODO: Please use 'source-map' in production environment
  // TODO: 建议上发布环境用 'source-map'
  console.log('node version', process.version);
  // config.devtool = 'none'
  config.devtool = 'source-map';
  return config;
};

// fix: https://github.com/gildas-lormeau/zip.js/issues/212#issuecomment-769766135
const fixZipCodecIssue = () => (config) => {
  config.module.rules.push({
    test: /\.js$/,
    loader: require.resolve('@open-wc/webpack-import-meta-loader'),
  });
  return config;
};

const config = process.env;

const removeEslint = () => (config) => {
  config.plugins = config.plugins.filter(
    (plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin',
  );
  return config;
};

let version = packageInfo.version;
let apaasBuildEnv = process.env.AGORA_APAAS_BUILD_ENV;
if (apaasBuildEnv) {
  version = `${packageInfo.version}`;
}

const webpackConfig = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  removeEslint(),
  webWorkerConfig(),
  sourceMap(),
  // addWebpackModuleRule({
  //   test: /\.worker\.js$/,
  //   use: { loader: 'worker-loader' },
  // }),
  // addWebpackExternals(setElectronDeps),
  adjustStyleLoaders((loader) => {
    loader.exclude = [
      path.resolve(__dirname, 'src', 'ui-kit', 'components', 'chat'),
    ];
  }),
  addStyleLoader(),
  addWebpackPlugin(
    new DefinePlugin({
      REACT_APP_AGORA_APP_RECORD_URL: JSON.stringify(
        config.REACT_APP_AGORA_APP_RECORD_URL,
      ),
      REACT_APP_AGORA_RESTFULL_TOKEN: JSON.stringify(
        config.REACT_APP_AGORA_RESTFULL_TOKEN,
      ),
      REACT_APP_AGORA_RECORDING_OSS_URL: JSON.stringify(
        config.REACT_APP_AGORA_RECORDING_OSS_URL,
      ),
      REACT_APP_AGORA_APP_RTM_TOKEN: JSON.stringify(
        config.REACT_APP_AGORA_APP_RTM_TOKEN,
      ),
      REACT_APP_AGORA_GTM_ID: JSON.stringify(config.REACT_APP_AGORA_GTM_ID),
      REACT_APP_BUILD_VERSION: JSON.stringify(version),
      REACT_APP_PUBLISH_DATE: JSON.stringify(dayjs().format('YYYY-MM-DD')),
      REACT_APP_NETLESS_APP_ID: JSON.stringify(config.REACT_APP_NETLESS_APP_ID),
      REACT_APP_AGORA_APP_ID: JSON.stringify(config.REACT_APP_AGORA_APP_ID),
      REACT_APP_AGORA_APP_CERTIFICATE: config.hasOwnProperty(
        'REACT_APP_AGORA_APP_CERTIFICATE',
      )
        ? JSON.stringify(`${config.REACT_APP_AGORA_APP_CERTIFICATE}`)
        : JSON.stringify(''),
      REACT_APP_AGORA_APP_TOKEN: JSON.stringify(
        config.REACT_APP_AGORA_APP_TOKEN,
      ),
      REACT_APP_AGORA_CUSTOMER_ID: JSON.stringify(
        config.REACT_APP_AGORA_CUSTOMER_ID,
      ),
      REACT_APP_AGORA_CUSTOMER_CERTIFICATE: JSON.stringify(
        config.REACT_APP_AGORA_CUSTOMER_CERTIFICATE,
      ),
      REACT_APP_AGORA_LOG: JSON.stringify(config.REACT_APP_AGORA_LOG),

      REACT_APP_AGORA_APP_SDK_DOMAIN: JSON.stringify(
        config.REACT_APP_AGORA_APP_SDK_DOMAIN,
      ),
      AGORA_APAAS_BRANCH_PATH: config.hasOwnProperty('AGORA_APAAS_BRANCH_PATH')
        ? JSON.stringify(`${process.env.AGORA_APAAS_BRANCH_PATH}`)
        : JSON.stringify(''),
    }),
  ),
  babelInclude([
    path.resolve('src'),
    path.resolve(__dirname, '../agora-rte-sdk/src'),
    path.resolve(__dirname, '../agora-meeting-core/src'),
    path.resolve(__dirname, '../agora-meeting-ui/src'),
  ]),
  babelExclude([
    path.resolve('node_modules'),
    {
      test: /\.stories.ts?x$/i,
    },
  ]),
  addWebpackPlugin(
    new HardSourceWebpackPlugin({
      root: process.cwd(),
      directories: [],
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: [
          'package.json',
          'package-lock.json',
          'yarn.lock',
          '.env',
          '.env.local',
          'env.local',
          'config-overrides.js',
          'webpack.config.js',
        ],
      },
    }),
  ),
  // useSW(),
  fixZipCodecIssue(),
  // useOptimizeBabelConfig(),
  addWebpackAlias({
    src: path.resolve(__dirname, 'src'),
    '@': path.resolve(__dirname, 'src'),
    '~ui-kit': path.resolve(__dirname, '../agora-meeting-ui/src'),
    '~components': path.resolve(
      __dirname,
      '../agora-meeting-ui/src/components',
    ),
    '~utilities': path.resolve(__dirname, '../agora-meeting-ui/src/utilities'),
  }),
  removeModuleScopePlugin(),
);

module.exports = webpackConfig;
