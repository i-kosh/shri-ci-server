import { resolve } from 'path'
import { Configuration } from 'webpack'
import { Options as TsLoaderOptions } from 'ts-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'

const dist = resolve(__dirname, 'dist')

const config: Configuration = {
  mode: 'development',
  target: 'web',
  watchOptions: {
    ignored: 'src/server/*',
  },
  entry: {
    app: './src/client/index.tsx',
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
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      publicPath: '/',
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
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
          } as TsLoaderOptions,
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

export default config
