import { render } from '@testing-library/react'
import React from 'react'
import { Box } from './index'

it('компонент отрисовывается', () => {
  const { container } = render(<Box>Test</Box>)

  expect(container.querySelector('.box')).toBeTruthy()
})
