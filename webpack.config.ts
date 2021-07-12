import { resolve } from 'path'
import { Configuration } from 'webpack'
import type { Options } from 'ts-loader'

const dist = resolve(__dirname, 'dist')

const common: Configuration = {
  mode: 'development',
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
    minimize: false,
  },
}

const server: Configuration = {
  ...common,
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
  ...common,
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

export default [server, agent]
