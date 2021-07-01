import { it, expect, describe, jest, afterEach } from '@jest/globals'
import { SingleRepoManager, Repo } from './Repo'
import { tmpdir } from 'os'

jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'info').mockImplementation(() => {})

afterEach(() => {
  jest.useRealTimers()
})

const testGitHubRepo = 'i-kosh/infomaximum-test-reactjs'
const testBuildCommandMatch = 'testValue'
const testBuildCommand = `echo ${testBuildCommandMatch}`

describe('Функционал вспомогательного менеджера', () => {
  it('метод updRepo возвращает инстанс Repo', () => {
    // @ts-ignore
    jest.spyOn(Repo.prototype, 'cloneRepo').mockImplementationOnce(() => {})

    const manager = new SingleRepoManager()
    const repo = manager.updRepo({
      repoName: testGitHubRepo,
      buildCommand: testBuildCommand,
    })

    expect(repo).toBeInstanceOf(Repo)
  })

  describe('метод getRepoAsync', () => {
    it('возвращает промис с инстансом Repo', async () => {
      // @ts-ignore
      jest.spyOn(Repo.prototype, 'cloneRepo').mockImplementationOnce(() => {})
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
      // @ts-ignore
      jest.spyOn(Repo.prototype, 'cloneRepo').mockImplementationOnce(() => {})
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
      // @ts-ignore
      jest.spyOn(Repo.prototype, 'cloneRepo').mockImplementationOnce(() => {})
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

describe('Repo', () => {
  describe('метод isGitDir', () => {
    it('должен определить гит директорию', async () => {
      // @ts-ignore
      jest.spyOn(Repo.prototype, 'cloneRepo').mockImplementationOnce(() => {})

      const repo = new Repo({
        repoName: testGitHubRepo,
        buildCommand: testBuildCommandMatch,
        mainBranch: 'master',
      })

      await expect(
        //@ts-expect-error
        repo.isGitDir(process.cwd())
      ).resolves.toBe(true)
    })

    it('НЕ должен определить гит директорию', async () => {
      // @ts-ignore
      jest.spyOn(Repo.prototype, 'cloneRepo').mockImplementationOnce(() => {})

      const repo = new Repo({
        repoName: testGitHubRepo,
        buildCommand: testBuildCommandMatch,
        mainBranch: 'master',
      })

      await expect(
        //@ts-expect-error
        repo.isGitDir(tmpdir())
      ).resolves.toBe(false)
    })
  })

  describe('метод waitRepoReady', () => {
    it('дожидается когда репозиторий будет склонирован', async () => {
      // @ts-ignore
      jest.spyOn(Repo.prototype, 'cloneRepo').mockImplementationOnce(() => {})

      const repo = new Repo({
        repoName: testGitHubRepo,
        buildCommand: testBuildCommandMatch,
        mainBranch: 'master',
      })

      jest.useFakeTimers()

      const promise = repo.waitRepoReady()
      expect(promise).toBeInstanceOf(Promise)

      repo.exist = true
      jest.advanceTimersToNextTimer()

      await expect(promise).resolves.toBeUndefined()
    })

    it('реджектится если репозиторий не был инициализирован', async () => {
      // @ts-ignore
      jest.spyOn(Repo.prototype, 'cloneRepo').mockImplementationOnce(() => {})

      const repo = new Repo({
        repoName: testGitHubRepo,
        buildCommand: testBuildCommandMatch,
        mainBranch: 'master',
      })

      jest.useFakeTimers()

      const promise = repo.waitRepoReady()
      expect(promise).toBeInstanceOf(Promise)

      repo.failed = true
      jest.advanceTimersToNextTimer()

      await expect(promise).rejects.toBeInstanceOf(Error)
    })
  })
})
