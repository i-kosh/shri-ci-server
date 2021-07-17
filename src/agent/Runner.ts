import simpleGit from 'simple-git'
import { tmpdir } from 'os'
import { v4 as uuid } from 'uuid'
import { promises as fs } from 'fs'
import { resolve } from 'path'
import axios from 'axios'
import cfg from './config'
import type { AgentResultRequestBody, AgentResultResponseBody } from '../types'
import { retry } from './utils'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { green, bold } from 'colors'
import { logError } from './utils'

const execFileAsync = promisify(execFile)

interface RunArgs {
  buildID: string
  command: string
  repoLink: string
  commitHash: string
}

const stub = () => {
  /** */
}

export class Runner {
  constructor(public readonly agentID: string) {}

  private isPathExist = async (path: string) => {
    const stat = await fs.stat(path).catch(stub)

    return stat != null
  }

  private reportBuild = async (data: AgentResultRequestBody) => {
    retry(
      async () => {
        return axios.post<AgentResultResponseBody>(
          `http://${cfg.SERVER_HOST}:${cfg.SERVER_PORT}${cfg.agentResultPath}`,
          data,
          {
            timeout: 5000,
          }
        )
      },
      {
        suppressError: true,
        label: `Reporting build id:${bold(data.id)}`,
        maxRetries: 10,
      }
    ).catch((err) => {
      logError(err)
      process.exit(1)
    })
  }

  private remove = async (path: string) => {
    console.log(`Removing ${bold(path)}`)

    await fs
      .rm(path, { force: true, recursive: true, maxRetries: 10 })
      .catch((err) => {
        console.error(err)
      })
  }

  private prepareRepo = async (link: string, hash: string): Promise<string> => {
    console.log(`Prepairing repo ${bold(link)}`)

    const tmp = tmpdir()

    let id = uuid()
    let repoPath = resolve(tmp, id)
    while (await this.isPathExist(repoPath)) {
      id = uuid()
      repoPath = resolve(tmp, id)
    }

    try {
      await fs.mkdir(repoPath)

      const repo = simpleGit({ baseDir: repoPath })
      console.log(`Cloning repo to ${bold(repoPath)}`)
      await repo.clone(link, repoPath)
      console.log(`Checkout to ${bold(hash)}`)
      await repo.checkout(hash)
    } catch (error) {
      await this.remove(repoPath)
      return Promise.reject(error)
    }

    return repoPath
  }

  public async run(params: RunArgs): Promise<void> {
    try {
      const repoPath = await this.prepareRepo(
        params.repoLink,
        params.commitHash
      )

      console.log(`Run build command: ${bold(params.command)}`)
      const { stderr, stdout } = await execFileAsync(params.command, {
        cwd: repoPath,
        shell: true,
        env: {
          ...process.env,
          FORCE_COLOR: 'true',
        },
        timeout: 1000 * 60 * 60 * 3, //3h
      }).finally(async () => {
        await this.remove(repoPath)
      })

      await this.reportBuild({
        agentID: this.agentID,
        id: params.buildID,
        log: `${stderr}\n${stdout}`,
        status: 'Success',
      })
    } catch (error) {
      let errMsg = 'Error while running build'
      if (error instanceof Error) {
        errMsg = `${error.name}: ${error.message}`
      }

      await this.reportBuild({
        agentID: this.agentID,
        id: params.buildID,
        status: 'Fail',
        log: errMsg,
      })
    }

    console.log(green(`Done ${bold(params.buildID)}`))
  }
}
