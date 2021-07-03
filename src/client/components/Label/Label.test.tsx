import React from 'react'
import { render } from '@testing-library/react'
import { Label } from './index'

it('при включенном пропе required появляется метка', () => {
  const { container } = render(
    <Label text="Заголовок" requiredMark>
      <input></input>
    </Label>
  )

  const markElem = container.querySelector('.label__text-mark')

  expect(markElem).toBeInTheDocument()
  expect(markElem).toHaveTextContent('*')
})
