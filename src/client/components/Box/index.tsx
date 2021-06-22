import React, { FC, HTMLAttributes } from 'react'
import classNames from 'classnames'
import './style.scss'

export interface BoxProps {
  className?: string
  modal?: boolean
  native?: HTMLAttributes<HTMLDivElement>
}

export const Box: FC<BoxProps> = (props) => {
  const { children, className, modal, native } = props
  const rootClasses =
    classNames({
      box: true,
      'box--modal': modal,
    }) + ` ${className || ''}`

  return (
    <div {...native} className={rootClasses}>
      {children}
    </div>
  )
}
