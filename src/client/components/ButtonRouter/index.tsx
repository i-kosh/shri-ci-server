import React, { FC, SyntheticEvent } from 'react'
import { useHistory } from 'react-router'
import { Button, ButtonProps } from '../Button'

export interface ButtonRouterProps {
  buttonProps?: ButtonProps
  path: string
}

export const ButtonRouter: FC<ButtonRouterProps> = (props) => {
  const { path, buttonProps, children } = props
  const history = useHistory()

  const clickHandler = (evt: SyntheticEvent<HTMLAnchorElement>) => {
    evt.preventDefault()
    history.push(path)
  }

  return (
    <Button
      {...buttonProps}
      tag="a"
      nativeAttrs={{
        href: path,
        onClick: clickHandler,
      }}
    >
      {children}
    </Button>
  )
}
