import cfg from '../config'
import axios from 'axios'
import type {
  AgentHealthCheckRequestBody,
  AgentHealthCheckResponseBody,
} from '../../types'

export const healthCheckReporter = (
  agentID: string,
  rate = 1000 * 60,
  maxTry = 3
): void => {
  // уменьшаем интервал чтобы всегда успевать отрепортить
  const intervalBuffer = 1000 * 3
  const interval = rate - intervalBuffer - 150
  let reportInProgress = false
  let tryCount = 0

  setInterval(
    async () => {
      if (!reportInProgress) {
        try {
          reportInProgress = true
          console.log('Reporting health...')

          const data: AgentHealthCheckRequestBody = {
            agentID: agentID,
          }
          await axios.post<AgentHealthCheckResponseBody>(
            `http://${cfg.SERVER_HOST}:${cfg.SERVER_PORT}${cfg.agentHealthPath}`,
            data,
            {
              timeout: intervalBuffer,
            }
          )

          tryCount = 0
        } catch (error) {
          if (tryCount >= maxTry) {
            console.error('Cannot report health, shutdown...')
            process.exit(0)
          } else {
            tryCount++
          }
        } finally {
          reportInProgress = false
        }
      }
    },
    interval > intervalBuffer * 2 ? interval : intervalBuffer * 2
  )
}
