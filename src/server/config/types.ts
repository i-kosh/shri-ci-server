export interface Config {
  NODE_ENV: 'production' | 'development' | string
  PORT: string
  TOKEN: string
  DB: string
  isDev: boolean
  isProd: boolean
  isDocker: boolean
  /** Размер интервала в минутах */
  AGENTS_REPORT_RATE: number
  /** Размер интервала в минутах */
  BUILDS_POLLING_RATE: number
}
