import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  name: 'server',
  displayName: 'server',

  preset: 'ts-jest',
  testEnvironment: 'node',

  testMatch: ['**/*.test.ts'],
}

export default config
