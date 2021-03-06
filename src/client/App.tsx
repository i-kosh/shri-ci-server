import React, { useEffect } from 'react'
import { NoSettings } from './pages/NoSettings'
import { BuildPage } from './pages/Build'
import { SettingsPage } from './pages/Settings'
import { BuildList } from './pages/BuildList'
import { NotFound } from './pages/404'
import { MetricsPage } from './pages/Metrics'
import { Switch, Route } from 'react-router-dom'
import { useLoadSettingsQuery } from './store/settingsApi'
import { useAppDispatch } from './store/hooks'
import { setSettings, selectSettings } from './store/settingsSlice'
import { useAppSelector } from './store/hooks'
import { ScrollToTop } from './components/ScrollToTop'
import { ToastDock } from './components/ToastBox'
import { ModalDock } from './components/Modal'
import { useMetrics } from './hooks/useMetrics'

function App(): JSX.Element {
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectSettings)
  const isSettings = settings.reponame && settings.command
  const { data, error, isLoading } = useLoadSettingsQuery(null)

  const { onSpinnerHide } = useMetrics()

  useEffect(() => {
    // Убираем спиннер
    const initSpinner = document.querySelector('#init-spinner')
    if (initSpinner) {
      onSpinnerHide()
      initSpinner.classList.add('init-spinner--hidden')
    }

    if (!error && data?.repoName && data?.buildCommand) {
      dispatch(
        setSettings({
          reponame: data.repoName,
          command: data.buildCommand,
          branch: data.mainBranch,
          minutes: `${data.period}`,
        })
      )
    }
  }, [data, error])

  return (
    <>
      <ScrollToTop />
      <ToastDock>
        <Switch>
          <Route exact path="/">
            {isSettings ? <BuildList /> : !isLoading ? <NoSettings /> : ''}
          </Route>
          <Route exact path="/settings">
            <SettingsPage />
          </Route>
          <Route exact path="/build/:buildId">
            <BuildPage />
          </Route>
          <Route exact path="/metrics">
            <MetricsPage />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </ToastDock>
      <ModalDock />
    </>
  )
}

export default App
