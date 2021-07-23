import axios from 'axios'
import { bold, green } from 'colors'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import type {
  AgentRegisterRequestBody,
  AgentRegisterResponseBody,
} from '../types'
import cfg from './config'
import buildHandler from './controllers/buildHandler'
import { healthCheckReporter } from './misc/healthCheckReporter'
import { registerExitHandlers } from './misc/processExitHandler'
import { logError, retry } from './utils'

const agent = express()
agent.use(cors())
agent.use(express.json())
agent.use(morgan('dev'))

agent.post('/build', buildHandler)

const startAgent = () => {
  console.log('Agent starting...')

  agent.listen(cfg.AGENT_PORT, async () => {
    console.log(`Agent started on port ${bold(`${cfg.AGENT_PORT}`)}`)

    try {
      const agentReqBody: AgentRegisterRequestBody = {
        host: `${cfg.AGENT_HOST}`,
        port: `${cfg.AGENT_PORT}`,
      }

      const { data } = await retry(
        () => {
          return axios.post<AgentRegisterResponseBody>(
            `http://${cfg.SERVER_HOST}:${cfg.SERVER_PORT}${cfg.agentRegisterPath}`,
            agentReqBody,
            {
              timeout: 5000,
            }
          )
        },
        {
          label: 'Agent registering...',
        }
      )
      if (!data) throw new Error('Unknown server response')

      registerExitHandlers(data.id)
      global.agentID = data.id

      healthCheckReporter(
        data.id,
        data.healthReportRate,
        data.maxHealthCheckMiss
      )

      console.log(green(`Agent registered id:${bold(global.agentID)}`))
    } catch (error) {
      logError(error)
      process.exit(1)
    }
  })
}
startAgent()
