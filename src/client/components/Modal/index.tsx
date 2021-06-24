import React, { FC, HTMLAttributes, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import './style.scss'

export interface ModalProps {
  nativeProps?: HTMLAttributes<HTMLDivElement>
  open: boolean
}

export const Modal: FC<ModalProps> = (props) => {
  const { children, nativeProps, open } = props

  const [states, setStates] = useState({
    isOpening: false,
    isClosing: false,
    isClosed: !open,
  })

  useEffect(() => {
    const animDuration = 290 //ms

    if (open) {
      setStates({
        ...states,
        isOpening: true,
        isClosed: false,
      })

      document.body.style.overflow = 'hidden'

      setTimeout(() => {
        setStates({
          ...states,
          isOpening: false,
          isClosed: false,
        })
      }, animDuration)
    } else {
      setStates({
        ...states,
        isClosing: true,
      })

      setTimeout(() => {
        document.body.style.overflow = ''
        setStates({
          ...states,
          isClosing: false,
          isClosed: true,
        })
      }, animDuration)
    }
  }, [open])

  const rootClasses = classNames({
    modal: true,
    'modal--closed': states.isClosed,
    'modal--closing': states.isClosing,
    'modal--opening': states.isOpening,
  })

  return createPortal(
    <div {...nativeProps} className={rootClasses}>
      <div className="modal__backdrop"></div>
      <div className="modal__content">{children}</div>
    </div>,
    document.querySelector('#modal-dock')!
  )
}
