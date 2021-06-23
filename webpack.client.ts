import { resolve } from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import autoprefixer from 'autoprefixer'

const dist = resolve(__dirname, 'dist')

const config: Configuration = {
  mode: 'development',
  devtool: 'eval-source-map',
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
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
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

export default config