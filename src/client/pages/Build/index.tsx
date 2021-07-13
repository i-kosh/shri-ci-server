import React, { FunctionComponent, useEffect } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { useParams, useHistory } from 'react-router-dom'
import { BuildCard } from '../../components/BuildCard'
import { Button } from '../../components/Button'
import { ReactComponent as ReloadSvg } from '../../assets/reload.svg'
import { LogsField } from '../../components/LogsField'
import './style.scss'
import { useAppSelector } from '../../store/hooks'
import { selectSettings } from '../../store/settingsSlice'
import {
  useFetchBuildQuery,
  useFetchBuildLogQuery,
} from '../../store/buildsApi'
import { getStatus } from '../../utils/getStatus'
import { useQueueBuild } from '../../hooks/useQueueBuild'
import { Spinner } from '../../components/Spinner'
import classNames from 'classnames'
import { useWasTrue } from '../../hooks/useWasTrue'

export const BuildPage: FunctionComponent = () => {
  const settings = useAppSelector(selectSettings)
  const { buildId } = useParams<{ buildId: string }>()
  // Тут тоже пока без кеша т.к непонятно как и когда инвалидировать его
  const build = useFetchBuildQuery(buildId, { refetchOnMountOrArgChange: true })
  const buildStatus = getStatus(build.data?.status || 'Waiting')
  const log = useFetchBuildLogQuery(buildId)
  const { queueNewBuild } = useQueueBuild()
  const history = useHistory()

  const isWasLoading = useWasTrue(build.isLoading)

  useEffect(() => {
    // Отвратительно зато работает
    if ((build.isSuccess && !build.data) || build.isError) {
      history.replace('/404')
    }
  }, [build.data, build.isSuccess, build.isError])

  useEffect(() => {
    if (!log.isUninitialized && log.isSuccess && !log.data) {
      // Перезагрузка лога если был закеширован пустой лог
      log.refetch()
    }
  }, [buildId])

  const settingsButton = (
    <>
      <div className="rebuild-button">
        <Button
          size="xs"
          nativeAttrs={{
            title: 'Rebuild',
            onClick: () => {
              if (build.data) {
                queueNewBuild(build.data.commitHash)
              }
            },
            disabled: !build.data,
          }}
        >
          <ReloadSvg />
        </Button>
      </div>
      <div className="rebuild-button-desktop">
        <Button
          size="sm"
          prepend={<ReloadSvg />}
          nativeAttrs={{
            onClick: () => {
              if (build.data) {
                queueNewBuild(build.data.commitHash)
              }
            },
            disabled: !build.data,
          }}
        >
          Rebuild
        </Button>
      </div>
    </>
  )

  return (
    <DefaultLayout title={settings.reponame} addButtons={settingsButton}>
      {build.isLoading ? (
        <div className="build-page-loader">
          <Spinner />
        </div>
      ) : (
        <div
          className={classNames({
            'build-page': true,
            appear: isWasLoading,
          })}
        >
          <BuildCard
            author={build.data?.authorName}
            commitHash={build.data?.commitHash}
            duration={
              build.data && 'duration' in build.data
                ? build.data.duration
                : undefined
            }
            number={build.data?.buildNumber}
            msg={build.data?.commitMessage}
            mainBranch={build.data?.branchName}
            status={buildStatus}
            startDate={
              build.data && 'start' in build.data ? build.data.start : undefined
            }
          />
          <LogsField
            className="log"
            log={
              log.isFetching
                ? 'Log is loading...'
                : log.data
                ? log.data
                : 'Log is not ready yet'
            }
          />
        </div>
      )}
    </DefaultLayout>
  )
}
