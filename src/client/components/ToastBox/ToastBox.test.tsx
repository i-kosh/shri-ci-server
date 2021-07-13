import React, { useContext, FC, useEffect } from 'react'
import { render, screen, act } from '@testing-library/react'
import { ToastDock, ToastsContext, ToastsCtx } from './index'

const TestComponent: FC<{
  fn: (ctx: ToastsCtx) => void
}> = ({ fn }) => {
  const toastCtx = useContext(ToastsContext)

  useEffect(() => {
    if (toastCtx) {
      fn(toastCtx)
    }
  }, [toastCtx])

  return <div>Test component</div>
}

afterEach(() => {
  jest.useRealTimers()
})

it('тосты появляются после добавления', () => {
  const toastText = 'ToastText'
  let ctx: ToastsCtx | undefined
  const fn = (context: ToastsCtx) => {
    ctx = context
  }

  render(
    <ToastDock>
      <TestComponent fn={fn}></TestComponent>
    </ToastDock>
  )

  act(() => {
    ctx?.add(1000, {
      content: toastText,
    })
  })
  expect(screen.queryByText(`${toastText}`)).toBeInTheDocument()
})

it('добавленные тосты исчезают после таймаута', () => {
  jest.useFakeTimers()

  const toastTimer = 1000
  const toastText = 'ToastText'
  let ctx: ToastsCtx | undefined
  const fn = (context: ToastsCtx) => {
    ctx = context
  }

  render(
    <ToastDock>
      <TestComponent fn={fn}></TestComponent>
    </ToastDock>
  )

  act(() => {
    ctx?.add(toastTimer, {
      content: toastText,
    })
    jest.advanceTimersByTime(toastTimer - 1)
  })
  // До конца таймера 1мс
  expect(screen.queryByText(`${toastText}`)).toBeInTheDocument()

  act(() => {
    jest.advanceTimersByTime(10)
  })
  // Таймер закончился тост должен пропасть
  expect(screen.queryByText(`${toastText}`)).not.toBeInTheDocument()
})
