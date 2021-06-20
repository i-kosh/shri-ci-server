import { config } from 'dotenv'
import { Config } from './types'
import validateConfig from '../utils/validateConfig'

const { parsed, error } = config()

if (error || !parsed) {
  console.log('Please create .env file as it shown in .env.example')
  process.exit(0)
}

const cfg: Config = {
  PORT: parsed.PORT || process.env.PORT || '3030',
  TOKEN: parsed.TOKEN,
  NODE_ENV: parsed.NODE_ENV || process.env.NODE_ENV || 'production',
  DB: parsed.DB,
}

validateConfig(cfg)

export default Object.freeze(cfg)
