import React, { FunctionComponent, useEffect, useState } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { Button } from '../../components/Button'
import { ReactComponent as PlaySvg } from '../../assets/play.svg'
import { BuildCard, BuildCardProps } from '../../components/BuildCard'
import { Modal } from '../../components/Modal'
import { Box } from '../../components/Box'
import { Input } from '../../components/Input'
import './style.scss'
import { useLazyFetchBuildsListQuery } from '../../store/buildsApi'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectSettings } from '../../store/settingsSlice'
import { selectBuildsList, addBuildsList } from '../../store/buildsSlice'
import type { Build } from '../../../types'

const getStatus = (status: Build['status']): BuildCardProps['status'] => {
  switch (status) {
    case 'Success':
      return 'success'
    case 'Waiting':
      return 'wait'
    default:
      return 'fail'
  }
}

export const BuildList: FunctionComponent = () => {
  const loadingLimit = 25
  const dispatch = useAppDispatch()

  const settings = useAppSelector(selectSettings)
  const buildList = useAppSelector(selectBuildsList)

  const [isModalOpen, setModalOpen] = useState(false)
  const [fetchBuilds, { data, isUninitialized }] = useLazyFetchBuildsListQuery()

  useEffect(() => {
    if (!buildList.length && isUninitialized)
      fetchBuilds({ limit: loadingLimit })

    if (data) {
      dispatch(addBuildsList(data))
    }
  }, [data])

  const noMoreBuilds = data && data.length < loadingLimit

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
      <ul className="build-list">
        {buildList.map((build) => (
          <li className="build-list__item" key={build.id}>
            <BuildCard
              author={build.authorName}
              commitHash={build.commitHash}
              duration={build.duration}
              mainBranch={build.branchName}
              msg={build.commitMessage}
              number={`${build.buildNumber}`}
              status={getStatus(build.status)}
              startDate={build.start}
              path={`/build/${build.id}`}
              selectable
              oneline
            ></BuildCard>
          </li>
        ))}
      </ul>

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
          ></Input>
          <Button className="newbuild__run" btnStyle="accent">
            Run build
          </Button>
          <Button
            className="newbuild__cancel"
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
