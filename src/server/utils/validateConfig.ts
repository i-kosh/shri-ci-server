import { Config } from '../config'

export default function (cfg: Config): void {
  try {
    if (!cfg.PORT) throw new Error(`env PORT is required got "${cfg.PORT}"`)
    if (!cfg.TOKEN)
      throw new Error(
        `env TOKEN is required got string length "${cfg.TOKEN.length}"`
      )
    if (!cfg.DB) throw new Error(`env DB is required got "${cfg.DB}"`)

    if (cfg.NODE_ENV !== 'production' && cfg.NODE_ENV !== 'development') {
      throw new Error('env NODE_ENV not production nor development ')
    }
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
}
