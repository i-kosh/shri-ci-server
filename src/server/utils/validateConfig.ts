import { Config } from '../config/types'

export default function (cfg: Config): void {
  if (!cfg.PORT) throw new Error('env PORT is mandatory')
  if (!cfg.TOKEN) throw new Error('env TOKEN is mandatory')
  if (!cfg.DB) throw new Error('env DB is mandatory')

  if (cfg.NODE_ENV !== 'production' && cfg.NODE_ENV !== 'development') {
    throw new Error('env NODE_ENV not production nor development ')
  }
}
