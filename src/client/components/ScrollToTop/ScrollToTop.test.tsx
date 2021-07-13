import React from 'react'
import { render } from '@testing-library/react'
import event from '@testing-library/user-event'
import { ScrollToTop } from './index'
import { Router, Switch, Route } from 'react-router'
import { Link } from 'react-router-dom'
import { createMemoryHistory } from 'history'

it('прокрутка после перехода срабатывает', () => {
  const mock = jest.spyOn(globalThis, 'scrollTo').mockImplementation(() => {})

  const testPath1 = '/'
  const testPath2 = '/test-path'

  const history = createMemoryHistory({
    initialEntries: [testPath1, testPath2],
    initialIndex: 1,
  })

  const { container } = render(
    <Router history={history}>
      <ScrollToTop />
      <Switch>
        <Route path={testPath2}>
          <Link to={testPath1}>На главную</Link>
        </Route>
        <Route path="*">
          <div data-testid="testId">Главная</div>
        </Route>
      </Switch>
    </Router>
  )

  expect(mock).toBeCalledTimes(1)

  const link = container.querySelector(`a[href="${testPath1}"]`)
  event.click(link!)

  expect(mock).toBeCalledTimes(2)

  mock.mockRestore()

  // screen.logTestingPlaygroundURL()
})
