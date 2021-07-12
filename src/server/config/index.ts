import { config } from 'dotenv'
import { Config } from './types'
import validateConfig from '../utils/validateConfig'

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
  PORT: process.env.PORT || isDocker ? '80' : '3030',
  TOKEN: process.env.TOKEN || '',
  DB: process.env.DB || '',
  AGENTS_REPORT_RATE_MS: parseInt(
    process.env.AGENTS_REPORT_RATE_MS || `${1000 * 60}`
  ),
}

console.log('Config:\n', { ...cfg, TOKEN: '******' })

validateConfig(cfg)

export default Object.freeze(cfg)
