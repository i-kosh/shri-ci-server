import React from 'react'
import { render, act } from '@testing-library/react'
import { Modal, ModalDock } from './index'

afterEach(() => {
  jest.useRealTimers()
})

it('модалки добавляются в док при отрисовке', () => {
  const { container } = render(<ModalDock />)

  const dock = container.querySelector('#modal-dock')
  expect(dock).toBeInTheDocument()

  render(<Modal open={false}></Modal>)
  let modals = dock!.getElementsByClassName('modal')
  expect(modals.length).toEqual(1)

  render(<Modal open={false}></Modal>)
  modals = dock!.getElementsByClassName('modal')
  expect(modals.length).toEqual(2)
})

it('модалки закрываются и открываются при изменении пропа open', () => {
  jest.useFakeTimers()

  const { container } = render(<ModalDock />)
  container.querySelector('#modal-dock')

  let open = false

  const { rerender } = render(<Modal open={open}></Modal>)
  act(() => {
    jest.runOnlyPendingTimers()
  })
  const modal = container.querySelector('.modal')!
  expect(modal).toHaveClass('modal--closed')

  open = true
  rerender(<Modal open={open}></Modal>)
  act(() => {
    jest.runOnlyPendingTimers()
  })
  expect(modal).not.toHaveClass('modal--closed')
})
