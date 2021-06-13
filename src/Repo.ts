import { execFile } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import { v5 as uuidv5 } from 'uuid'
import fs from 'fs/promises'

const execFileAsync = promisify(execFile)

export interface CommitInfo {
  hash: string
  author: string
  message: string
}

export interface RepoParams {
  repoLink: string
  mainBranch: string
  buildCommand: string
}

export interface RunBuildReturn {
  log: string
  success: boolean
}

export class RepoError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

export class Repo {
  public exist: boolean
  public failed: boolean
  public fullPath: string
  private folderName: string

  constructor(public readonly params: RepoParams) {
    this.failed = !this.isGitLink(params.repoLink)
    this.exist = false
    this.folderName = uuidv5(
      params.repoLink,
      '5235fde0-caf5-11eb-878d-7303d56e8e0a'
    )
    this.fullPath = join(tmpdir(), this.folderName)

    void this.cloneRepo()
  }

  private get gitDirFlag() {
    return `--git-dir=${join(this.fullPath, '/.git')}`
  }

  private isGitLink(link: string): boolean {
    return link.endsWith('.git')
  }

  private async isGitDir(path: string): Promise<boolean> {
    try {
      const gtiStat = await fs.stat(join(path, '.git'))

      if (gtiStat.isDirectory() && gtiStat.size > 1) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  private waitRepoReady(): Promise<void> {
    const interval = 100
    let intervalID: NodeJS.Timeout

    return new Promise((resolve) => {
      intervalID = setInterval(() => {
        if (this.failed) {
          clearInterval(intervalID)
          throw new Error('Repo failed')
        }

        if (this.exist) {
          clearInterval(intervalID)
          return resolve()
        }
      }, interval)
    })
  }

  private async checkout(to: string): Promise<void> {
    await this.waitRepoReady()
    await execFileAsync('git', [this.gitDirFlag, 'checkout', to])
  }

  private async cloneRepo(): Promise<void> {
    try {
      if (this.failed) return
      if (await this.isGitDir(this.fullPath)) {
        this.exist = true
        return
      }

      await execFileAsync('git', ['clone', this.params.repoLink, this.fullPath])

      const gitDirCloned = await this.isGitDir(this.fullPath)
      if (!gitDirCloned) {
        throw new RepoError('Repository cloning error')
      }

      this.exist = true
    } catch (error) {
      this.exist = false
      this.failed = true
      console.error(error)
    }
  }

  public async getCommitInfo(hash: string): Promise<CommitInfo> {
    await this.waitRepoReady()
    const formatString = '%H&%an&%s' // hash&author&message
    const formatSeparator = '&'

    const { stdout } = await execFileAsync('git', [
      this.gitDirFlag,
      'show',
      '-s',
      `--format="${formatString}"`,
      hash,
    ])

    const parsed: string[] | undefined = stdout
      .split('"')[1]
      ?.split(formatSeparator)

    if (Array.isArray(parsed) && parsed[0] && parsed[1] && parsed[2]) {
      return {
        hash: parsed[0],
        author: parsed[1],
        message: parsed[2],
      }
    } else {
      throw new RepoError('Error occured while getting commit info')
    }
  }

  public async runBuild(commitHash: string): Promise<RunBuildReturn> {
    let log = ''
    let success = false

    try {
      await this.waitRepoReady()
      await this.checkout(commitHash)

      // TODO: санитизировать buildCommand
      const { stderr, stdout } = await execFileAsync(
        `${this.params.buildCommand}`,
        { cwd: this.fullPath, shell: true }
      )

      log = `${stdout}\n${stderr}`
      success = true
    } catch (error) {
      log = `${log}\n${error}`
      success = false
    }

    return {
      log,
      success,
    }
  }
}

class SingleRepoManager {
  private repoLink?: string
  private repoInstanse?: Repo

  updRepo(params: RepoParams) {
    if (this.repoLink === params.repoLink) return

    this.repoLink = params.repoLink
    this.repoInstanse = new Repo(params)

    console.info(`💨 Changed repo to ${params.repoLink}`)
  }

  public getRepoAsync(): Promise<Repo> {
    const maxTimeOut = 1000 * 60 * 1
    const interval = 100
    let fullTimeout = 0

    return new Promise((resolve, reject) => {
      const timeout = setInterval(() => {
        const repo = this.repoInstanse ? this.repoInstanse : null

        if (repo) {
          clearTimeout(timeout)
          resolve(repo)
        } else {
          fullTimeout = fullTimeout + interval
        }

        if (fullTimeout >= maxTimeOut) {
          clearTimeout(timeout)
          reject(new Error('Repo initialization timeout (1min)'))
        }
      }, interval)
    })
  }
}

export const repoManager = new SingleRepoManager()
