import React, { FunctionComponent } from 'react'
import { DefaultLayout } from '../../layouts/Default'
// import { useParams } from 'react-router-dom'
import { BuildCard } from '../../components/BuildCard'
import { Button } from '../../components/Button'
import { ReactComponent as ReloadSvg } from '../../assets/reload.svg'
import { LogsField } from '../../components/LogsField'
import './style.scss'

import { log } from '../../testlog'

export const BuildPage: FunctionComponent = () => {
  // const params = useParams<{ buildId: string }>()

  // TODO: не забыть
  const oneHour = 3_600_000
  const tenMins = 600_000
  const testDuration = oneHour * 3 + tenMins * 2.5 // 3 h 25 min
  const testDate = '2021-04-17T10:20:30.931Z'

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
    <DefaultLayout
      title="philip1967/my-awesome-repo"
      addButtons={settingsButton}
    >
      <BuildCard
        author="Philip Kirkorov"
        commitHash="34e4kf8j384d2w3dijf9"
        duration={testDuration}
        number="1"
        msg="add documentation for postgres scaler"
        mainBranch="main"
        status="success"
        startDate={testDate}
      />

      <LogsField className="log" log={log} />
    </DefaultLayout>
  )
}
