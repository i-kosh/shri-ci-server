import { execFile } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'
import { v5 as uuidv5 } from 'uuid'
import fs from 'fs/promises'

const execFileAsync = promisify(execFile)

export class Repo {
  public exist: boolean
  public failed: boolean
  private fullPath: string
  private folderName: string

  constructor(private repoLink: string) {
    this.failed = this.isGitLink(repoLink)
    this.exist = false
    this.folderName = uuidv5(repoLink, '5235fde0-caf5-11eb-878d-7303d56e8e0a')
    this.fullPath = join(tmpdir(), this.folderName)

    this.cloneRepo()
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

  private async cloneRepo(): Promise<void> {
    if (this.failed) return
    if (await this.isGitDir(this.fullPath)) return

    try {
      await execFileAsync('git', ['clone', this.repoLink, this.fullPath])

      if (!(await this.isGitDir(this.fullPath))) {
        this.failed = true
        throw new Error('Repository cloning error')
      }

      this.exist = true
    } catch (error) {
      this.exist = false
      this.failed = true
      console.error(error)
    }
  }
}

class SingleRepoManager {
  private repoLink?: string
  private repoInstanse?: Repo

  updRepo(repoLink: string) {
    if (this.repoLink === repoLink) return

    this.repoLink = repoLink
    this.repoInstanse = new Repo(repoLink)

    console.info(`New repo ${repoLink}`)
  }

  getRepo(): Repo | null {
    return this.repoInstanse ? this.repoInstanse : null
  }
}

export const repoManager = new SingleRepoManager()
