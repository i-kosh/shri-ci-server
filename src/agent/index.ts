import './types'
import { registerExitHandlers } from './misc/processExitHandler'
import express from 'express'
import buildHandler from './controllers/buildHandler'
import axios from 'axios'
import cfg from './config'
import type {
  AgentRegisterRequestBody,
  AgentRegisterResponseBody,
} from '../types'
import { green, bold } from 'colors'
import { retry, logError } from './utils'
import cors from 'cors'
import morgan from 'morgan'
import { healthCheckReporter } from './misc/healthCheckReporter'

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
