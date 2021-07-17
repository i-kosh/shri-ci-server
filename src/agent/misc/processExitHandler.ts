import axios from 'axios'
import cfg from '../config'
import type {
  AgentUnregisterRequestBody,
  AgentUnregisterResponseBody,
} from '../../types'
import { red, underline } from 'colors'
import { logError } from '../utils'

let itWasUnregisteredAlready = false
const unregisterSelf = async (agentID: string, error: string) => {
  if (!itWasUnregisteredAlready) {
    try {
      console.log(red('Unregistering self...'))
      const data: AgentUnregisterRequestBody = {
        agentID,
        error,
      }
      await axios.post<AgentUnregisterResponseBody>(
        `http://${cfg.SERVER_HOST}:${cfg.SERVER_PORT}${cfg.agentUnregisterPath}`,
        data,
        {
          timeout: 1500,
        }
      )

      itWasUnregisteredAlready = true
      console.log(red('Done, now closing...'))
    } catch (error) {
      logError(error)
      process.exit(1)
    }
  }
}

export const registerExitHandlers = (agentID: string): void => {
  process.on('SIGINT', async () => {
    await unregisterSelf(agentID, 'Agent closed (SIGINT)')
    process.exit(0)
  })
  process.on('SIGUSR1', async () => {
    await unregisterSelf(agentID, 'Agent closed (SIGUSR1)')
    process.exit(0)
  })
  process.on('SIGUSR2', async () => {
    await unregisterSelf(agentID, 'Agent closed (SIGUSR2)')
    process.exit(0)
  })
  process.on('uncaughtException', async (err) => {
    await unregisterSelf(agentID, 'Agent closed (uncaughtException)')
    logError(err)
    process.exit(1)
  })
  process.on('beforeExit', async (code) => {
    await unregisterSelf(agentID, 'Agent closed (uncaughtException)')
    console.log(underline(`Agent is about exit with code ${code}`))
  })
  process.on('exit', (code) => {
    unregisterSelf(agentID, 'Agent closed (uncaughtException)')
    console.log(underline(`Agent exited with code ${code}`))
  })
}
