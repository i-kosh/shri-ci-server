import type { Options } from 'ts-loader'
import { resolve } from 'path'
import { Configuration, DefinePlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import autoprefixer from 'autoprefixer'
import { green, yellow } from 'colors'

if (
  process.env.NODE_ENV !== 'development' &&
  process.env.NODE_ENV !== 'production'
) {
  process.env.NODE_ENV = 'production'
}
console.log(green(`NODE_ENV=${process.env.NODE_ENV}`))

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  console.log(yellow('Development build'))
} else {
  console.log(green('Production build'))
}

const dist = resolve(__dirname, 'dist')

// ### Client ###

const client: Configuration = {
  name: 'client',
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : false,
  target: 'web',
  watchOptions: {
    ignored: 'src/server/*',
  },
  entry: {
    app: './src/client/index.tsx',
    metrics: './src/client/metrics/index.ts',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: 'static/[name].js',
    path: dist,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      publicPath: '/',
      excludeChunks: ['metrics'],
    }),
    new MiniCssExtractPlugin({
      filename: 'static/[name].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/public/*.*',
          to: resolve(dist, 'static/[name][ext]'),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer(), postcssPresetEnv()],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },
          },
          'url-loader',
        ],
      },
    ],
  },
}

// ### Server ###
const serverCommonConfig: Configuration = {
  mode: isDev ? 'development' : 'production',
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'server/[name].js',
    path: dist,
  },
  optimization: {
    minimize: !isDev,
  },
}

const server: Configuration = {
  ...serverCommonConfig,
  name: 'server',
  entry: {
    server: './src/server/server.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: resolve(__dirname, './src/server/tsconfig.json'),
          } as Options,
        },
      },
    ],
  },
}

const agent: Configuration = {
  ...serverCommonConfig,
  name: 'agent',
  entry: {
    agent: './src/agent/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: resolve(__dirname, './src/agent/tsconfig.json'),
          } as Options,
        },
      },
    ],
  },
}

export default [client, server, agent]
