const path = require('path');

const disableEsLint = (e) => {
  return (
    e.module.rules
      .filter(
        (e) =>
          e.use &&
          e.use.some((e) => e.options && void 0 !== e.options.useEslintrc),
      )
      .forEach((s) => {
        e.module.rules = e.module.rules.filter((e) => e !== s);
      }),
    e
  );
};

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
  ],
  babel: async (options) => {
    return {
      ...options,
    };
  },
  webpackFinal: async (config) => {
    config = disableEsLint(config);
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        presets: [
          '@babel/preset-typescript',
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
        ],
        plugins: [
          ['@babel/plugin-proposal-nullish-coalescing-operator'],
          ['@babel/plugin-proposal-optional-chaining'],
        ],
      },
    });
    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            // ident: 'postcss',
            postcssOptions: {
              plugins: [require('tailwindcss'), require('autoprefixer')],
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      ['@']: path.resolve(__dirname, '../src'),
      '~ui-kit': path.resolve(__dirname, '../src'),
      '~components': path.resolve(__dirname, '../src/components'),
      '~utilities': path.resolve(__dirname, '../src/utilities'),
    };

    config.resolve.modules = [
      path.resolve(__dirname, '../', 'node_modules'),
      'node_modules',
    ];

    config.plugins = config.plugins.filter(
      (plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin',
    );

    config.resolve.extensions.push('.ts', '.tsx', '.js');
    return config;
  },
};
