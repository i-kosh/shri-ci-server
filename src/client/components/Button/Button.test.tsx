import React from 'react'
import { render, screen } from '@testing-library/react'
import event from '@testing-library/user-event'
import { Button } from './index'

it('можно добавить prepend рендер проп', () => {
  const testValue = 'Test'

  render(<Button prepend={<div>{testValue}</div>} />)

  expect(screen.getByText(/test/i)).toHaveTextContent(testValue)

  // screen.logTestingPlaygroundURL()
})

it('выключенная кнопка не фаерит события', () => {
  const mockFn = jest.fn()

  render(<Button disabled nativeAttrs={{ onClick: mockFn }} />)
  const button = screen.getByRole('button')
  event.click(button)

  expect(mockFn).toBeCalledTimes(0)

  // screen.logTestingPlaygroundURL()
})
