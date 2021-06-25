import buildModel, { BuildModel } from './models/Build'
import { QueueBuildConfig, UUID } from './models/types'
import { repoManager } from './Repo'
import { queue, QueueObject } from 'async'
import { yellow } from 'colors'

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
      console.log(
        yellow(
          `Starting new queue task: ${task.id} on commit: ${task.commitHash}`
        )
      )

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

      console.log(
        yellow(
          `Build task complete: ${
            task.id
          }, rest in queue ${this.queue.length()}`
        )
      )
    }, this.concurrent)
  }

  public async add(cfg: QueueBuildConfig['data']): Promise<AddReturn> {
    const repo = await repoManager.getRepoAsync()

    const response = await buildModel.queueBuild({
      data: cfg,
    })

    void this.queue
      .pushAsync({
        id: response.data.data.id,
        commitHash: cfg.commitHash,
        buildCommand: repo.params.buildCommand,
      })
      .catch((err) => {
        console.error(err)
        void buildModel
          .reportBuildCanceled({
            data: {
              buildId: response.data.data.id,
            },
          })
          .catch(() => {
            // noop
          })
      })

    console.log(
      yellow(
        `Add new build to queue ${
          response.data.data.id
        }, current queue size ${this.queue.length()}`
      )
    )

    return response
  }
}

export default new BuildQueue()
