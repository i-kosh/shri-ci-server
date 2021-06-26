import { execFile } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import { v5 as uuidv5 } from 'uuid'
import fs from 'fs/promises'
import { yellow, underline, green, red } from 'colors'

const execFileAsync = promisify(execFile)

export interface CommitInfo {
  hash: string
  author: string
  message: string
}

export interface RepoParams {
  repoName: string
  buildCommand: string
  mainBranch?: string
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
  /** Флаг сигнализирующий что репозиторий существует (был загружен) в файловой системе */
  public exist: boolean
  /** Флаг сигнализирующий что дальнейшая работа с репозиторием невозможна */
  public failed: boolean
  /** Текст ошибки */
  public failedMsg?: string
  /** Абсолютный путь до репозитория на ФС */
  public fullPath: string
  /** Имя папки с репозиторием */
  private folderName: string
  /** Ссылка на репозиторий */
  private repoLink: string

  constructor(public readonly params: RepoParams) {
    this.failed = false
    this.exist = false
    this.folderName = uuidv5(
      params.repoName,
      '5235fde0-caf5-11eb-878d-7303d56e8e0a'
    )
    this.fullPath = join(tmpdir(), this.folderName)
    // Предпологаем что repoLink это валидный гитхаб репозиторий
    this.repoLink = `git@github.com:${this.params.repoName}.git`

    void this.cloneRepo()
  }

  /**
   * Проверяет что это директория с гитом
   * @param path путь до папки с гитом
   */
  private async isGitDir(path: string): Promise<boolean> {
    try {
      const gitStat = await fs.stat(join(path, '.git'))

      if (gitStat.isDirectory() && gitStat.size > 1) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  /**
   * Позволяет дождаться момента когда репозиторий будет склонирован
   * и будет готов к работе
   */
  public waitRepoReady(): Promise<void> {
    const interval = 100
    let intervalID: NodeJS.Timeout

    return new Promise((resolve, reject) => {
      intervalID = setInterval(() => {
        if (this.failed) {
          clearInterval(intervalID)
          reject(new RepoError(this.failedMsg || 'Repo initialization failed'))
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
    await execFileAsync('git', ['checkout', '-f', to], {
      cwd: this.fullPath,
    })
    console.log(yellow(`Checkout repo to ${to}`))
  }

  private async cloneRepo(): Promise<void> {
    try {
      if (this.failed) {
        console.log(underline('Repo failed, abort cloning'))
        return
      }

      if (await this.isGitDir(this.fullPath)) {
        this.exist = true
        console.log(
          underline(`Repo already exist ${this.fullPath}, abort cloning`)
        )
        return
      }

      await execFileAsync('git', ['clone', this.repoLink, this.fullPath])

      const gitDirCloned = await this.isGitDir(this.fullPath)
      if (!gitDirCloned) {
        fs.rm(this.fullPath, {
          recursive: true,
          force: true,
          maxRetries: 3,
        }).catch(() => {
          // noop
        })

        throw new RepoError('Repository cloning error')
      }

      console.log(underline(`New repo cloned ${this.fullPath}`))

      this.exist = true
    } catch (error) {
      this.exist = false
      this.failed = true

      if (error instanceof Error) {
        this.failedMsg = error.message
      }

      console.error(error)
    }
  }

  public async getCommitInfo(hash: string): Promise<CommitInfo> {
    await this.waitRepoReady()
    const formatString = '%H&%an&%s' // hash&author&message
    const formatSeparator = '&'

    const { stdout } = await execFileAsync(
      'git',
      ['show', '-s', `--format="${formatString}"`, hash],
      { cwd: this.fullPath }
    )

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

      console.log(
        yellow(
          `Running build command "${this.params.buildCommand}" on repo ${this.params.repoName}`
        )
      )

      // TODO: санитизировать buildCommand?
      const { stderr, stdout } = await execFileAsync(
        `${this.params.buildCommand}`,
        {
          cwd: this.fullPath,
          shell: true,
          env: {
            ...process.env,
            FORCE_COLOR: 'true',
          },
        }
      )

      log = `${stdout}\n${stderr}`
      success = true
    } catch (error) {
      log = `${log}\n${error}`
      success = false
    }

    const result = success ? 'completed' : 'failed'
    const resultColor = success ? green : red
    console.log(
      resultColor(`Build command "${this.params.buildCommand}" - ${result}`)
    )

    return {
      log,
      success,
    }
  }
}

class SingleRepoManager {
  private repoLink?: string
  private repoInstanse?: Repo

  public updRepo(params: RepoParams): Repo {
    this.repoLink = params.repoName
    this.repoInstanse = new Repo(params)

    console.info(`💨 Update repo to ${params.repoName}`)

    return this.repoInstanse
  }

  /**
   * Позволяет асинхронно получить текущий инстанс репозитория.
   *
   * Ожидает что в ближайшее время будет/был вызван метод `updRepo`
   * иначе падает с таймаутом
   */
  public getRepoAsync(): Promise<Repo> {
    const maxTimeOut = 1000 * 60 * 0.5 // 30s
    const interval = 100 // ms
    let fullTimeout = 0

    return new Promise((resolve, reject) => {
      const timeout = setInterval(() => {
        const repo = this.repoInstanse ? this.repoInstanse : null

        if (repo) {
          if (repo.failed) {
            clearTimeout(timeout)
            reject(new RepoError('Repo initialization failed'))
          } else {
            clearTimeout(timeout)
            resolve(repo)
          }
        } else {
          fullTimeout = fullTimeout + interval
        }

        if (fullTimeout >= maxTimeOut) {
          clearTimeout(timeout)
          reject(new RepoError('Repo initialization timeout (30s)'))
        }
      }, interval)
    })
  }
}

export const repoManager = new SingleRepoManager()
