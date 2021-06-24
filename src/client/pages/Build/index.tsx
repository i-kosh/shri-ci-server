import React, { FunctionComponent } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { useParams } from 'react-router-dom'
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

export const BuildPage: FunctionComponent = () => {
  const settings = useAppSelector(selectSettings)
  const { buildId } = useParams<{ buildId: string }>()
  const build = useFetchBuildQuery(buildId)
  const buildStatus = getStatus(build.data?.status || 'Waiting')
  const log = useFetchBuildLogQuery(buildId)

  const settingsButton = (
    <>
      <div className="rebuild-button">
        <Button
          size="xs"
          nativeAttrs={{
            title: 'Rebuild',
          }}
        >
          <ReloadSvg />
        </Button>
      </div>
      <div className="rebuild-button-desktop">
        <Button size="sm" prepend={<ReloadSvg />}>
          Rebuild
        </Button>
      </div>
    </>
  )

  return (
    <DefaultLayout title={settings.reponame} addButtons={settingsButton}>
      <div className="build-page">
        <BuildCard
          author={build.data?.authorName}
          commitHash={build.data?.commitHash}
          duration={build.data?.duration || 0}
          number={build.data?.buildNumber}
          msg={build.data?.commitMessage}
          mainBranch={build.data?.branchName}
          status={buildStatus}
          startDate={build.data?.start || ''}
        />
        <LogsField className="log" log={log.data} />
      </div>
    </DefaultLayout>
  )
}
