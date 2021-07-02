import React from 'react'
import { render, screen } from '@testing-library/react'
import event from '@testing-library/user-event'
import { Input } from './index'

it('запускается проп onChange при вводе', () => {
  const cb = jest.fn()

  const testText = 'test test'

  render(<Input onChange={cb} />)
  event.type(screen.getByRole('textbox'), testText)

  expect(cb).toBeCalledTimes(testText.length)
  expect(cb).nthCalledWith<string[]>(testText.length, testText)

  // screen.logTestingPlaygroundURL()
})

it('срабатывает кнопка отчистки', () => {
  const testText = 'test test'
  render(<Input clearable />)

  const input = screen.getByRole('textbox')
  event.type(input, testText)

  expect(input).toHaveValue(testText)

  const clearButton = screen.getByRole('button', {
    name: /clear/i,
  })
  event.click(clearButton)

  expect(input).toHaveValue('')

  // screen.logTestingPlaygroundURL()
})
