import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  projects: ['src/server/jest.config.ts', 'src/client/jest.config.ts'],
}

export default config
