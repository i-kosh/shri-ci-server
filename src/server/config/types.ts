export interface Config {
  NODE_ENV: 'production' | 'development' | string
  PORT: string
  TOKEN: string
  DB: string
  isDev: boolean
  isProd: boolean
  AGENTS_REPORT_RATE_MS: number
}
