import { config } from 'dotenv'
import { Config } from './types'
import validateConfig from '../utils/validateConfig'

const { parsed, error } = config()

if (error || !parsed) {
  throw error
}

const cfg: Config = {
  PORT: parsed.PORT || process.env.PORT || '3030',
  TOKEN: parsed.TOKEN,
  NODE_ENV: parsed.NODE_ENV || process.env.NODE_ENV || 'production',
}

validateConfig(cfg)

export default Object.freeze(cfg)
