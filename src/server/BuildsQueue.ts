import { grey, red, yellow } from 'colors'
import cfg from './config'
import buildModel from './models/Build'
import agentsQueue from './AgentsQueue'
import axios from 'axios'
import {
  AgentBuildRequestBody,
  BuildWaiting,
  AgentBuildResponseBody,
} from '../types'
import settingsModel from './models/Settings'

interface QueuedBuild {
  id: string
  startTimestamp: number
}

export class BuildsQueue {
  private pollingInterval: number
  private pollingIntervalID?: NodeJS.Timeout
  private pollingInProgress: boolean
  private queuedBuilds: QueuedBuild[]

  constructor() {
    this.pollingInterval = cfg.BUILDS_POLLING_RATE * 60 * 1000 // переводим в мс
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

      let tryNumber = 0
      const maxTry = 3

      const dispatchTask = async () => {
        // Если было превышено кол-во попыток отменяем билд
        if (tryNumber >= maxTry) {
          console.log(red(`Cancel build ${req.id}`))

          buildModel
            .reportBuildCanceled({ data: { buildId: req.id } })
            .catch(() => null)
          return
        } else {
          tryNumber++
        }

        // Ждем свободного агента
        const agent = await agentsQueue.reserveFreeAgent()
        agent.onKilled.push(async (reason) => {
          // Коллбэк на случай если агент помрет
          try {
            const buildResponse = await buildModel.getBuildDetails({
              params: {
                buildId: req.id,
              },
            })
            const build = buildResponse.data.data

            // Если этот билд в статусе InProgress - ретраим
            if (build.status === 'InProgress') {
              if (reason) {
                console.log(yellow(`Retrying build ${req.id} (${reason})`))
              }

              await dispatchTask()
            }
          } catch (error) {
            // БД не ответила - отменяем билд
            buildModel
              .reportBuildCanceled({ data: { buildId: req.id } })
              .catch(() => null)
          }
        })

        // Отдаем команду агенту
        await axios
          .post<AgentBuildResponseBody>(
            `http://${agent.host}:${agent.port}/build`,
            req,
            {
              timeout: 10000,
            }
          )
          .catch(() => {
            // Агент по какой-то причине не принял команду
            console.error(
              `Agent ${agent.id} not responsed or responsed with error`
            )

            // Ретраим
            dispatchTask()
            agentsQueue.freeAgent(agent.id)
          })
      }

      try {
        await dispatchTask()
        await buildModel.reportBuildStarted({
          data: { buildId: req.id, dateTime: new Date().toISOString() },
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  private removeFromQueue(id: string) {
    this.queuedBuilds = this.queuedBuilds.filter((val) => val.id !== id)
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
          const onlyWaitingBuilds = builds
            .filter((build): build is BuildWaiting => {
              // Небольшой сайдэффект - удаляем из очереди билды у которых статус сменился с 'Waiting' на другой
              if (build.status !== 'Waiting') {
                this.removeFromQueue(build.id)
              }

              // Явно отменяем билды которые слишком долго выполняются
              const maxInProgress = 1000 * 60 * 60 * 3 // 3h
              if (
                build.status === 'InProgress' &&
                Date.now() - new Date(build.start + 'Z').valueOf() >
                  maxInProgress
              ) {
                buildModel
                  .reportBuildCanceled({ data: { buildId: build.id } })
                  .then(() => {
                    console.log(
                      `Marking build ${build.id} as canceled (3h timeout)`
                    )
                  })
                  .catch(() => null)
              }

              return build.status === 'Waiting'
            })
            .reverse()

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
