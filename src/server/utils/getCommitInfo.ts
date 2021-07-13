import { promises as fsAsync } from 'fs'
import simpleGit from 'simple-git'
import { resolve } from 'path'
import { tmpdir } from 'os'
import { v4 as uuid } from 'uuid'

export interface CommitInfo {
  hash: string
  author: string
  message: string
}

export const getCommitInfo = async (
  repolink: string,
  commitHash: string
): Promise<CommitInfo> => {
  const tmpDir = tmpdir()
  const dirName = uuid()
  const dirPath = resolve(tmpDir, dirName)

  try {
    await fsAsync.mkdir(dirPath)

    const repo = simpleGit(dirPath)

    await repo.clone(repolink, dirPath)
    await repo.checkout(commitHash)

    const show = await repo.show(['-s', '--format="%H&%an&%s"', commitHash])

    const [hash, author, message] = show.split('"')[1].split('&')

    await fsAsync
      .rm(dirPath, { force: true, recursive: true, maxRetries: 10 })
      .catch(() => {
        /*STUB*/
      })

    return {
      author,
      hash,
      message,
    }
  } catch (error) {
    await fsAsync
      .rm(dirPath, { force: true, recursive: true, maxRetries: 10 })
      .catch(() => {
        /*STUB*/
      })
    return Promise.reject(error)
  }
}
