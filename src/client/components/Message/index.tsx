import React, { FC } from 'react'
import classNames from 'classnames'
import './style.scss'

export interface MessageProps {
  style?: 'Error' | 'Success' | 'Warn' | 'Accent'
}

export const Message: FC<MessageProps> = (props) => {
  const { children, style } = props

  const rootClasses = classNames({
    msg: true,
    'msg--error': style === 'Error',
    'msg--success': style === 'Success',
    'msg--warn': style === 'Warn',
    'msg--accent': style === 'Accent',
  })

  return <div className={rootClasses}>{children}</div>
}
