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
}

export class RepoError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

export class Repo {
  public exist: boolean
  public failed: boolean
  private fullPath: string
  private folderName: string

  constructor(public readonly params: RepoParams) {
    this.failed = !this.isGitLink(params.repoLink)
    this.exist = false
    this.folderName = uuidv5(
      params.repoLink,
      '5235fde0-caf5-11eb-878d-7303d56e8e0a'
    )
    this.fullPath = join(tmpdir(), this.folderName)

    this.cloneRepo()
  }

  private get gitDirFlag() {
    return `--git-dir=${join(this.fullPath, '/.git')}`
  }

  private isGitLink(link: string): boolean {
    return link.endsWith('.git')
  }

  private async isGitDir(path: string): Promise<boolean> {
    try {
      const stat = await fs.stat(path)

      if (stat.isDirectory() && stat.size > 1) {
        const dir = await fs.readdir(path)
        return dir.includes('.git')
      }

      return false
    } catch (error) {
      return false
    }
  }

  /**
   * Ждет готовности репозитория (клонирование и проверка)
   * @returns `true` - репозиторий готов, `false` - ошибка проверки репозитория
   */
  private waitRepoReady(): Promise<boolean> {
    let intervalID: NodeJS.Timeout

    return new Promise((resolve) => {
      intervalID = setInterval(() => {
        if (this.failed) {
          clearInterval(intervalID)
          return resolve(false)
        }

        if (this.exist) {
          clearInterval(intervalID)
          return resolve(true)
        }
      }, 100)
    })
  }

  private async cloneRepo(): Promise<void> {
    if (this.failed) return
    if (await this.isGitDir(this.fullPath)) {
      this.exist = true
      return
    }

    try {
      await execFileAsync('git', ['clone', this.params.repoLink, this.fullPath])

      if (!(await this.isGitDir(this.fullPath))) {
        throw new RepoError('Repository cloning error')
      }

      this.exist = true
    } catch (error) {
      this.exist = false
      this.failed = true
      console.error(error)
    }
  }

  public async getCommitInfo(hash: string): Promise<CommitInfo | null> {
    const formatString = '%H&%an&%s' // hash&author&message
    const formatSeparator = '&'

    try {
      if (!(await this.waitRepoReady())) return null

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
      }

      throw new RepoError('Error occured while getting commit info')
    } catch (error) {
      console.error(error)
      return null
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

    console.info(`New repo ${params.repoLink}`)
  }

  getRepo(): Repo | null {
    return this.repoInstanse ? this.repoInstanse : null
  }
}

export const repoManager = new SingleRepoManager()
