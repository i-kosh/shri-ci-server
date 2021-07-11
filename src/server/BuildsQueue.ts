import { grey } from 'colors'
import cfg from './config'
import buildModel from './models/Build'
import agentsQueue from './AgentsQueue'
import axios from 'axios'
import { AgentBuildRequestBody, BuildWaiting } from '../types'
import settingsModel from './models/Settings'

interface QueueConfig {
  pollingIntervalMs?: number
}

interface QueuedBuild {
  id: string
  startTimestamp: number
}

export class BuildsQueue {
  private pollingInterval: number
  private pollingIntervalID?: NodeJS.Timeout
  private pollingInProgress: boolean
  private queuedBuilds: QueuedBuild[]

  constructor(param: QueueConfig) {
    const devInterval = 1000 * 10 // 10s
    const prodInterval = param.pollingIntervalMs || 1000 * 60 * 3 // 3min
    this.pollingInterval = cfg.isDev ? devInterval : prodInterval
    this.pollingInProgress = false
    this.queuedBuilds = []
  }

  private async delegateBuildTask(req: AgentBuildRequestBody) {
    const isBuildAlreadyInQueue =
      this.queuedBuilds.findIndex((val) => val.id === req.id) > -1

    if (!isBuildAlreadyInQueue) {
      this.queuedBuilds.push({
        id: req.id,
        startTimestamp: Date.now(),
      })
      const agent = await agentsQueue.reserveFreeAgent()

      try {
        await axios.post(`http://${agent.host}:${agent.port}/build`, req, {
          timeout: 5000,
        })

        await buildModel.reportBuildStarted({
          data: { buildId: req.id, dateTime: new Date().toISOString() },
        })
      } catch (error) {
        // TODO: Что делать с агентами которые нехотят отвечать?
        console.error(`Agent ${agent.id} not responsed or responsed with error`)
        agentsQueue.freeAgent(agent.id)
      }
    }
  }

  start(): void {
    this.pollingIntervalID = setInterval(async () => {
      if (!this.pollingInProgress) {
        this.pollingInProgress = true
        console.log(grey(`Checking for new build requests...`))

        try {
          const buildsResponse = await buildModel.getBuildList({
            params: { offset: 0, limit: 100 },
          })
          const builds = buildsResponse.data.data
          const onlyWaitingBuilds = builds.filter(
            (build): build is BuildWaiting => {
              return build.status === 'Waiting'
            }
          )

          if (onlyWaitingBuilds.length) {
            console.log(
              grey(`Found ${onlyWaitingBuilds.length} new build request`)
            )

            const settingsResp = await settingsModel.getSettings()
            const settings = settingsResp.data.data
            if (!settings) throw new Error('No settings found')

            onlyWaitingBuilds.forEach(async (build) => {
              await this.delegateBuildTask({
                command: settings.buildCommand,
                commitHash: build.commitHash,
                id: build.id,
                repo: `https://github.com/${settings.repoName}.git`,
              })
            })
          }
        } catch (error) {
          console.error(error)
        } finally {
          this.pollingInProgress = false
        }
      }
    }, this.pollingInterval)
  }

  stop(): void {
    if (this.pollingIntervalID) {
      clearInterval(this.pollingIntervalID)
    }
  }
}
