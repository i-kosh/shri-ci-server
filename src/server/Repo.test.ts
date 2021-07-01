import { it, expect, describe, jest, afterEach } from '@jest/globals'
import { SingleRepoManager, Repo } from './Repo'

jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'info').mockImplementation(() => {})

// @ts-ignore
jest.spyOn(Repo.prototype, 'cloneRepo').mockImplementation(() => {})

afterEach(() => {
  jest.useRealTimers()
})

const testGitHubRepo = 'i-kosh/infomaximum-test-reactjs'
const testBuildCommandMatch = 'testValue'
const testBuildCommand = `echo ${testBuildCommandMatch}`

describe('Функционал вспомогательного менеджера', () => {
  it('метод updRepo возвращает инстанс Repo', () => {
    const manager = new SingleRepoManager()
    const repo = manager.updRepo({
      repoName: testGitHubRepo,
      buildCommand: testBuildCommand,
    })

    expect(repo).toBeInstanceOf(Repo)
  })

  describe('метод getRepoAsync', () => {
    it('возвращает промис с инстансом Repo', async () => {
      jest.useFakeTimers()

      const manager = new SingleRepoManager()
      manager.updRepo({
        repoName: testGitHubRepo,
        buildCommand: testBuildCommand,
      })
      const promise = manager.getRepoAsync()
      expect(promise).toBeInstanceOf(Promise)

      jest.runOnlyPendingTimers()

      const repo = await promise
      expect(repo).toBeInstanceOf(Repo)
    })

    it('падает с ошибкой если инициализация Repo сфейлилась', async () => {
      jest.useFakeTimers()

      const manager = new SingleRepoManager()
      const repo = manager.updRepo({
        repoName: testGitHubRepo,
        buildCommand: testBuildCommand,
      })
      const promise = manager.getRepoAsync()

      repo.failed = true

      jest.runOnlyPendingTimers()

      await expect(promise).rejects.toBeInstanceOf(Error)
    })

    it('падает с ошибкой если вышел таймаут инициализации', async () => {
      jest.useFakeTimers()

      const manager = new SingleRepoManager()
      const promise = manager.getRepoAsync()

      jest.advanceTimersByTime(1000 * 31) // 31s

      await expect(promise).rejects.toHaveProperty(
        'message',
        'Repo initialization timeout (30s)'
      )
    })
  })
})
