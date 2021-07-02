import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  name: 'client',
  displayName: 'client',

  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jestSetup.ts'],
}

export default config
