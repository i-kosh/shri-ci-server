import { render } from '@testing-library/react'
import React from 'react'
import { BuildCard } from './index'

it.each(['success', 'fail', 'wait'] as const)(
  'проп status меняет класс',
  (status) => {
    const { container } = render(<BuildCard status={status}></BuildCard>)

    const elem = container.querySelector('.build-card')
    expect(elem).toHaveClass(`build-card--${status}`)

    // screen.logTestingPlaygroundURL()
  }
)
