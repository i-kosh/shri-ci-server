import React from 'react'
import { render, screen } from '@testing-library/react'
import { BuildCard } from './index'

it.each(['success', 'fail', 'wait'])('проп status меняет класс', (status) => {
  const { container } = render(<BuildCard status={status as any}></BuildCard>)

  const elem = container.querySelector('.build-card')
  expect(elem).toHaveClass(`build-card--${status}`)

  // screen.logTestingPlaygroundURL()
})
