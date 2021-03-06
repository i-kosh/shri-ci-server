import React, { FunctionComponent, useState } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { Button } from '../../components/Button'
import { ReactComponent as PlaySvg } from '../../assets/play.svg'
import { BuildCard } from '../../components/BuildCard'
import { Modal } from '../../components/Modal'
import { Box } from '../../components/Box'
import { Input } from '../../components/Input'
import { useAppSelector } from '../../store/hooks'
import { selectSettings } from '../../store/settingsSlice'
import { getStatus } from '../../utils/getStatus'
import { useBuildList } from './useBuildList'
import { useQueueBuild } from '../../hooks/useQueueBuild'
import { Spinner } from '../../components/Spinner'
import './style.scss'
import { useWasTrue } from '../../hooks/useWasTrue'
import classNames from 'classnames'

export const BuildList: FunctionComponent = () => {
  const settings = useAppSelector(selectSettings)
  const { buildList, noMoreBuilds, fetchBuilds, loadingLimit, isLoading } =
    useBuildList()
  const [isModalOpen, setModalOpen] = useState(false)
  const { queueNewBuild, isLoading: newBuildPending } = useQueueBuild()
  const [newBuildRef, setNewBuildRef] = useState<string | number>('')

  const itWasLoading = useWasTrue(isLoading)

  const settingsButton = (
    <>
      <div className="run-build-button">
        <Button
          size="xs"
          nativeAttrs={{
            title: 'Run build',
            onClick: () => {
              setModalOpen(true)
            },
          }}
        >
          <PlaySvg />
        </Button>
      </div>
      <div className="run-build-button-desktop">
        <Button
          size="sm"
          prepend={<PlaySvg />}
          nativeAttrs={{
            onClick: () => {
              setModalOpen(true)
            },
          }}
        >
          Run build
        </Button>
      </div>
    </>
  )

  return (
    <DefaultLayout addButtons={settingsButton} title={settings.reponame}>
      {buildList.length ? (
        <ul
          className={classNames({
            'build-list': true,
            appear: itWasLoading,
          })}
        >
          {buildList.map((build) => (
            <li className="build-list__item" key={build.id}>
              <BuildCard
                author={build.authorName}
                commitHash={build.commitHash}
                duration={'duration' in build ? build.duration : undefined}
                mainBranch={build.branchName}
                msg={build.commitMessage}
                number={`${build.buildNumber}`}
                status={getStatus(build.status)}
                startDate={'start' in build ? build.start : undefined}
                path={`/build/${build.id}`}
                selectable
                oneline
              ></BuildCard>
            </li>
          ))}
        </ul>
      ) : isLoading ? (
        <div className="build-list__no-builds">
          <Spinner />
        </div>
      ) : (
        <p className="build-list__no-builds">No builds yet</p>
      )}

      {!noMoreBuilds && (
        <Button
          className="build-list__more"
          nativeAttrs={{
            onClick: () => {
              fetchBuilds({
                offset: buildList.length,
                limit: loadingLimit,
              })
            },
          }}
        >
          Show more
        </Button>
      )}

      <Modal open={isModalOpen}>
        <Box modal className="build-list__newbuild newbuild">
          <h2 className="newbuild__title">New build</h2>
          <p className="newbuild__sub">
            Enter the commit hash which you want to build.
          </p>
          <Input
            className="newbuild__input"
            clearable
            nativeAttrs={{
              placeholder: 'Commit hash',
            }}
            onChange={(val) => {
              setNewBuildRef(val)
            }}
          ></Input>
          <Button
            className="newbuild__run"
            btnStyle="accent"
            disabled={!newBuildRef || newBuildPending}
            nativeAttrs={{
              onClick: () => {
                queueNewBuild(`${newBuildRef}`)
              },
            }}
          >
            Run build
          </Button>
          <Button
            className="newbuild__cancel"
            disabled={newBuildPending}
            nativeAttrs={{
              onClick: () => {
                setModalOpen(false)
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </DefaultLayout>
  )
}
