import React, { useEffect } from 'react'
import { NoSettings } from './pages/NoSettings'
import { BuildPage } from './pages/Build'
import { SettingsPage } from './pages/Settings'
import { BuildList } from './pages/BuildList'
import { NotFound } from './pages/404'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useLoadSettingsQuery } from './store/settingsApi'
import { useAppDispatch } from './store/hooks'
import { setSettings, selectSettings } from './store/settingsSlice'
import { useAppSelector } from './store/hooks'

function App(): JSX.Element {
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectSettings)
  const isSettingsExistAndLoaded = settings.reponame && settings.command
  const { data, error } = useLoadSettingsQuery(null)

  useEffect(() => {
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

  const ifNoStettings = (
    <Switch>
      <Route exact path="/">
        <NoSettings />
      </Route>

      <Route exact path="/settings">
        <SettingsPage />
      </Route>

      <Redirect to="/" />
    </Switch>
  )

  return (
    <>
      {!isSettingsExistAndLoaded ? (
        ifNoStettings
      ) : (
        <Switch>
          <Route exact path="/">
            <BuildList />
          </Route>

          <Route exact path="/build/:buildId">
            <BuildPage />
          </Route>

          <Route exact path="/settings">
            <SettingsPage />
          </Route>

          <Route>
            <NotFound />
          </Route>
        </Switch>
      )}
    </>
  )
}

export default App
