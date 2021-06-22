import React, { FunctionComponent, useState } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { Button } from '../../components/Button'
import { ReactComponent as PlaySvg } from '../../assets/play.svg'
import { BuildCard, BuildCardProps } from '../../components/BuildCard'
import { Modal } from '../../components/Modal'
import { Box } from '../../components/Box'
import { Input } from '../../components/Input'
import './style.scss'

export const BuildList: FunctionComponent = () => {
  const [isModalOpen, setModalOpen] = useState(false)

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

  const testData: BuildCardProps[] = [
    {
      author: 'Philip Kirkorov',
      commitHash: '952e5567ffdfho38932u',
      duration: '8742834',
      mainBranch: 'main',
      msg: 'Super cool UI kit for making websites that look like games',
      number: '67289342',
      startDate: '2021-04-17T10:20:30.931Z',
      status: 'wait',
      oneline: true,
      selectable: true,
    },
    {
      author: 'Philip Kirkorov',
      commitHash: '952e5567ffdfho38932u',
      duration: '8742834',
      mainBranch: 'main',
      msg: 'Super cool UI kit for making websites that look like games',
      number: '67289342',
      startDate: '2021-04-17T10:20:30.931Z',
      status: 'success',
      oneline: true,
      selectable: true,
    },
    {
      author: 'Philip Kirkorov',
      commitHash: '952e5567ffdfho38932u',
      duration: '8742834',
      mainBranch: 'main',
      msg: 'Super cool UI kit for making websites that look like games',
      number: '342342342',
      startDate: '2021-04-17T10:20:30.931Z',
      status: 'fail',
      oneline: true,
      selectable: true,
    },
    {
      author: 'Philip Kirkorov',
      commitHash: '952e5567ffdfho38932u',
      duration: '8742834',
      mainBranch: 'main',
      msg: 'Super cool UI kit for making websites that look like games',
      number: '342342342',
      startDate: '2021-04-17T10:20:30.931Z',
      status: 'fail',
      oneline: true,
      selectable: true,
    },
    {
      author: 'Philip Kirkorov',
      commitHash: '952e5567ffdfho38932u',
      duration: '8742834',
      mainBranch: 'main',
      msg: 'Super cool UI kit for making websites that look like games',
      number: '67289342',
      startDate: '2021-04-17T10:20:30.931Z',
      status: 'wait',
      oneline: true,
      selectable: true,
    },
  ]

  return (
    <DefaultLayout
      addButtons={settingsButton}
      title="philip1967/my-aw
    esome-repo-with-long-long-long-repo-name"
    >
      <ul className="build-list">
        {testData.map((props, i) => (
          <li className="build-list__item" key={i}>
            <BuildCard {...props} path={`/build/${props.number}`}></BuildCard>
          </li>
        ))}
      </ul>

      <Button className="build-list__more ">Show more</Button>

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
