import buildModel, { BuildModel } from './models/Build'
import { DBError } from './models/db'
import { QueueBuildCOnfig, UUID } from './models/types'
import { repoManager } from './Repo'

export interface QueuedBuild {
  id: UUID
  commitHash: string
  buildCommand: string
}

class BuildQueue {
  private queue: Array<QueuedBuild>
  private buildsInProgress: number

  constructor(private concurrent = 1) {
    this.queue = []
    this.buildsInProgress = 0
  }

  private waitQueue(): Promise<boolean> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.buildsInProgress < this.concurrent) {
          clearInterval(interval)
          resolve(true)
        }
      }, 3000)
    })
  }

  private async proccessQueue() {
    try {
      const repo = repoManager.getRepo()
      if (!repo) throw new Error('Repo error')

      while (this.queue.length && (await this.waitQueue())) {
        const current = this.queue.shift()
        if (!current) return

        await buildModel.reportBuildStarted({
          data: {
            buildId: current.id,
            dateTime: new Date().toISOString(),
          },
        })

        const buildStartTimestamp = Date.now()

        this.buildsInProgress++
        const { log, success } = await repo.runBuild(current.commitHash)
        this.buildsInProgress--

        await buildModel.reportBuildFinished({
          data: {
            buildId: current.id,
            success,
            buildLog: log,
            duration: Date.now() - buildStartTimestamp,
          },
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  private addToQueue(build: QueuedBuild) {
    this.queue.push(build)

    if (this.buildsInProgress < 1) {
      this.proccessQueue()
    }
  }

  public async add(
    cfg: QueueBuildCOnfig['data']
  ): Promise<ReturnType<BuildModel['queueBuild']>> {
    try {
      const repo = repoManager.getRepo()
      if (!repo) throw new Error('Repo error')

      const response = await buildModel.queueBuild({
        data: cfg,
      })

      if (buildModel.isError(response) || !response.data.data) return response

      this.addToQueue({
        id: response.data.data?.id,
        commitHash: cfg.commitHash,
        buildCommand: repo.params.buildCommand,
      })

      return response
    } catch (error) {
      console.error(error)
      return new DBError('Error while add to queue')
    }
  }
}

export default new BuildQueue()
