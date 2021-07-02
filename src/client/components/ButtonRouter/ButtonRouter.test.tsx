import React from 'react'
import { render, screen } from '@testing-library/react'
import event from '@testing-library/user-event'
import { ButtonRouter } from './index'
import { Router, Switch, Route } from 'react-router'
import { createMemoryHistory } from 'history'

it('можно добавить prepend рендер проп', () => {
  const testPath1 = '/'
  const testPath2 = '/test-path'

  const history = createMemoryHistory({
    initialEntries: [testPath1, testPath2],
    initialIndex: 1,
  })

  const { container } = render(
    <Router history={history}>
      <Switch>
        <Route path={testPath2}>
          <ButtonRouter path={testPath1}>На главную</ButtonRouter>
        </Route>
        <Route path="*">
          <div data-testid="testId">Главная</div>
        </Route>
      </Switch>
    </Router>
  )

  let button = container.querySelector(`a[href="${testPath1}"]`)
  let testElem = screen.queryByText(/Главная/i)

  expect(button).toBeInTheDocument()
  expect(testElem).not.toBeInTheDocument()

  event.click(button!)

  button = container.querySelector(`a[href="${testPath1}"]`)
  testElem = screen.queryByText(/Главная/i)

  expect(button).not.toBeInTheDocument()
  expect(testElem).toBeInTheDocument()

  // screen.logTestingPlaygroundURL()
})
