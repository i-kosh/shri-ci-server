import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  name: 'client',
  displayName: 'client',

  testMatch: ['**/*.test.{ts,tsx}'],
}

export default config
