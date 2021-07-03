import React from 'react'
import { render } from '@testing-library/react'
import router, { Router, Switch, Route } from 'react-router'
import { createMemoryHistory } from 'history'
import { DefaultLayout } from './index'

beforeEach(() => {
  jest.restoreAllMocks()
})

it('отрисовывает переданный контент', () => {
  jest.spyOn(router, 'useRouteMatch').mockReturnValue(null)
  const history = createMemoryHistory()

  const { queryByText } = render(
    <Router history={history}>
      <DefaultLayout>
        <div>Test content</div>
      </DefaultLayout>
    </Router>
  )

  expect(queryByText('Test content')).toBeInTheDocument()
})

it('если находимся на странице настроек кнопка перехода к настройкам скрыта', () => {
  jest
    .spyOn(router, 'useRouteMatch')
    .mockReturnValueOnce(null)
    .mockReturnValue({} as any)
  const settingsRoute = '/settings'
  const history = createMemoryHistory({
    initialEntries: [settingsRoute, '/'],
    initialIndex: 1,
  })

  const { container } = render(
    <Router history={history}>
      <Switch>
        <Route path={settingsRoute}>
          <DefaultLayout>
            <div>Settings</div>
          </DefaultLayout>
        </Route>

        <Route path="*">
          <DefaultLayout>
            <div>Other</div>
          </DefaultLayout>
        </Route>
      </Switch>
    </Router>
  )

  // Находимся на странице настроек
  const settingsButton = container.querySelector(`a[href="${settingsRoute}"]`)
  expect(settingsButton).toBeInTheDocument()

  // Переходим на другую страницу
  history.goBack()

  expect(settingsButton).not.toBeInTheDocument()
})
