import React, {
  FC,
  createContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import { v4 as uuid } from 'uuid'
import { Message, MessageProps } from '../Message'
import './style.scss'

export interface Toast {
  content?: ReactNode
  msg?: {
    text: ReactNode
    props: MessageProps
  }
  key?: string
}

type ToastWithKey = Toast & { key: string }

export interface ToastsCtx {
  add: (time: number, toast: Toast) => void
}

export const ToastsContext = createContext<ToastsCtx | undefined>(undefined)

const dockId = 'toast-dock'

export const ToastBox: FC = (props) => {
  const { children } = props

  return createPortal(
    <div className="toast">{children}</div>,
    document.querySelector(`#${dockId}`)!
  )
}

export const ToastDock: FC = ({ children }) => {
  const [dockList, setDockList] = useState<ToastWithKey[]>([])
  const [ctx, updCtx] = useState<ToastsCtx>()
  const ref = useRef(dockList)

  useEffect(() => {
    ref.current = dockList

    updCtx({
      add: (time, toast) => {
        const toastClone = { ...toast }
        if (!toastClone.key) toastClone.key = uuid()
        const key = toastClone.key
        const toastWithKey = toastClone as ToastWithKey

        setDockList(dockList.concat(toastWithKey))

        setTimeout(() => {
          setDockList(ref.current?.filter((val) => val.key !== key))
        }, time)
      },
    })
  }, [dockList])

  return (
    <ToastsContext.Provider value={ctx}>
      {children}

      <div id={dockId}>
        {dockList.map((toast) => (
          <ToastBox key={toast.key}>
            {toast.content ? (
              toast.content
            ) : (
              <Message {...toast.msg?.props}>{toast.msg?.text}</Message>
            )}
          </ToastBox>
        ))}
      </div>
    </ToastsContext.Provider>
  )
}
