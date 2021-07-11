import { config } from 'dotenv'
import { Config } from './types'
import validateConfig from '../utils/validateConfig'

const { parsed, error } = config()

if (error || !parsed) {
  console.log('Please create .env file as it shown in .env.example')
  process.exit(0)
}

const NODE_ENV = parsed.NODE_ENV || process.env.NODE_ENV || 'production'

const oneMin = 1000 * 60

const cfg: Config = {
  PORT: parsed.PORT || process.env.PORT || '3030',
  TOKEN: parsed.TOKEN,
  NODE_ENV,
  DB: parsed.DB,
  isDev: NODE_ENV === 'development',
  isProd: NODE_ENV === 'production',
  AGENTS_REPORT_RATE_MS: parseInt(parsed.AGENTS_REPORT_RATE_MS) || oneMin,
}

console.log('Config:\n', { ...cfg, TOKEN: '******' })

validateConfig(cfg)

export default Object.freeze(cfg)
