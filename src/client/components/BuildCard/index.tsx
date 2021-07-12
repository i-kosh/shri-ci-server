import React, { FC, AnchorHTMLAttributes } from 'react'
import { ReactComponent as SuccessSvg } from '../../assets/success.svg'
import { ReactComponent as FailSvg } from '../../assets/fail.svg'
import { ReactComponent as WaitSvg } from '../../assets/wait.svg'
import { ReactComponent as UserSvg } from '../../assets/user.svg'
import { ReactComponent as CommitSvg } from '../../assets/commit.svg'
import { ReactComponent as CalendarSvg } from '../../assets/calendar.svg'
import { ReactComponent as TimeSvg } from '../../assets/time.svg'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import './style.scss'
import { useStartDateAndDuration } from './useStartDateAndDuration'

export interface BuildCardProps {
  status: 'success' | 'wait' | 'fail' | 'canceled' | 'inProgress'
  number?: string | number
  msg?: string
  mainBranch?: string
  commitHash?: string
  author?: string
  startDate?: string
  duration?: number | string
  selectable?: boolean
  className?: string
  oneline?: boolean
  path?: string
}

export const BuildCard = React.memo<BuildCardProps>((props) => {
  const {
    className,
    author,
    commitHash,
    duration,
    mainBranch,
    msg,
    number,
    status,
    startDate,
    selectable,
    oneline,
    path,
  } = props

  const rootClassnames = classnames(
    {
      'build-card': true,
      'build-card--success': status === 'success',
      'build-card--fail': status === 'fail',
      'build-card--wait': status === 'wait',
      'build-card--inProgress': status === 'inProgress',
      'build-card--canceled': status === 'canceled',
      'build-card--selectable': selectable,
      'build-card--oneline': oneline,
      'build-card--link': !!path,
    },
    className
  )

  const shortHash = commitHash?.slice(0, 6)
  const { durationString, startDateString } = useStartDateAndDuration(
    startDate,
    duration
  )

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Build сompleted successfully'
      case 'fail':
        return 'Build failed'
      case 'inProgress':
        return 'Build in progress'
      case 'wait':
        return 'Build waiting'

      default:
        return 'Build was canceled'
    }
  }

  const statusIcon =
    status === 'success' ? (
      <SuccessSvg />
    ) : status === 'fail' || status === 'canceled' ? (
      <FailSvg />
    ) : (
      <WaitSvg />
    )

  const linkProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: path || '',
    onClick: (evt) => {
      evt.preventDefault()
      history.push(path || '/')
    },
  }
  const Tag: FC = path
    ? ({ children }) => (
        <a className={rootClassnames} {...linkProps}>
          {children}
        </a>
      )
    : ({ children }) => <div className={rootClassnames}>{children}</div>

  const history = useHistory()

  return (
    <Tag>
      <div>
        <div className="build-card__status-message">
          <p className="build-card__status">
            <span className="build-card__status-icon" title={getStatusText()}>
              {statusIcon}
            </span>
            <span className="build-card__number">#{number}</span>
          </p>

          <div className="build-card__message">{msg}</div>
        </div>

        <div className="build-card__commit">
          <p className="build-card__branch">
            <span className="build-card__icon">
              <CommitSvg />
            </span>
            <span>{mainBranch}</span>
            <span className="build-card__branch-hash">{shortHash}</span>
          </p>
          <p className="build-card__author">
            <span className="build-card__icon">
              <UserSvg />
            </span>
            <span>{author}</span>
          </p>
        </div>
      </div>

      {startDateString && durationString && (
        <div className="build-card__timing">
          {startDateString && (
            <p className="build-card__startdate">
              <span className="build-card__icon">
                <CalendarSvg />
              </span>
              <span>{startDateString}</span>
            </p>
          )}

          {durationString && (
            <p className="build-card__duration">
              <span className="build-card__icon">
                <TimeSvg />
              </span>

              <span>{durationString}</span>
            </p>
          )}
        </div>
      )}
    </Tag>
  )
})
