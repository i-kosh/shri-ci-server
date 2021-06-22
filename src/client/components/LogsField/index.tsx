import React, { FC } from 'react'
import classNames from 'classnames'
import Convert from 'ansi-to-html'
import './style.scss'

export interface LogsFieldProps {
  className?: string
  log: string
}

const convert = new Convert({
  newline: true,
  fg: '#000',
  bg: '#000',
})

export const LogsField: FC<LogsFieldProps> = (props) => {
  const { className, log } = props
  const rootClasses =
    classNames({
      'logs-field': true,
    }) + ` ${className || ''}`

  return (
    <pre
      className={rootClasses}
      dangerouslySetInnerHTML={{
        __html: convert.toHtml(log.trim()),
      }}
    ></pre>
  )
}
