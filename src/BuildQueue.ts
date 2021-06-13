import buildModel, { BuildModel } from './models/Build'
import { QueueBuildConfig, UUID } from './models/types'
import { repoManager } from './Repo'
import { queue, QueueObject } from 'async'

export interface QueuedBuild {
  id: UUID
  commitHash: string
  buildCommand: string
}
export type QueueType = QueueObject<QueuedBuild>
export type AddReturn = ReturnType<BuildModel['queueBuild']>

class BuildQueue {
  private queue: QueueType

  constructor(private concurrent = 1) {
    this.queue = queue(async (task) => {
      const repo = await repoManager.getRepoAsync()

      await buildModel.reportBuildStarted({
        data: {
          buildId: task.id,
          dateTime: new Date().toISOString(),
        },
      })

      const buildStartTimestamp = Date.now()
      const { log, success } = await repo.runBuild(task.commitHash)

      await buildModel.reportBuildFinished({
        data: {
          buildId: task.id,
          success,
          buildLog: log,
          duration: Date.now() - buildStartTimestamp,
        },
      })
    }, this.concurrent)
  }

  public async add(cfg: QueueBuildConfig['data']): Promise<AddReturn> {
    const repo = await repoManager.getRepoAsync()
    const response = await buildModel.queueBuild({
      data: cfg,
    })

    await this.queue.pushAsync({
      id: response.data.data.id,
      commitHash: cfg.commitHash,
      buildCommand: repo.params.buildCommand,
    })

    return response
  }
}

export default new BuildQueue()
