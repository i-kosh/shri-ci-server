import { config } from 'dotenv'
import validateConfig from '../utils/validateConfig'

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

if (process.env.DOCKER) {
  console.info('🐳 Running in docker')
} else {
  const { parsed, error } = config()

  if (error || !parsed) {
    console.log('Please create .env file as it shown in .env.example')
    process.exit(0)
  }

  console.info('⚙ Running in standard environment (.env loaded)')
}

const NODE_ENV = process.env.NODE_ENV || 'production'
const isDocker = !!process.env.DOCKER
const cfg: Config = {
  NODE_ENV,
  isDocker,
  isDev: NODE_ENV === 'development',
  isProd: NODE_ENV === 'production',
  PORT: process.env.PORT || (isDocker ? '80' : '3030'),
  TOKEN: process.env.TOKEN || '',
  DB: process.env.DB || '',
  AGENTS_REPORT_RATE: parseInt(process.env.AGENTS_REPORT_RATE || '1'),
  BUILDS_POLLING_RATE: parseInt(process.env.BUILDS_POLLING_RATE || '1'),
}

console.log('Config:\n', { ...cfg, TOKEN: '******' })

validateConfig(cfg)

export default Object.freeze(cfg)
