import React, { FunctionComponent, useEffect } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { InputWithLabel } from '../../components/InputWithLabel'
import { InputShort } from '../../components/InputShort'
import { Button } from '../../components/Button'
import { ButtonRouter } from '../../components/ButtonRouter'
import { useFormik } from 'formik'
import { setSettings, selectSettings } from '../../store/settingsSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import './style.scss'

export const SettingsPage: FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectSettings)
  const formic = useFormik({
    initialValues: {
      repo: settings.reponame,
      command: settings.command,
      branch: settings.branch,
      minutes: settings.minutes,
    },
    validate: (values) => {
      const errors = {} as Partial<typeof values>

      if (!values.repo) {
        errors.repo = 'Required'
      }

      if (!values.command) {
        errors.command = 'Required'
      }

      return errors
    },
    onSubmit: (values) => {
      dispatch(
        setSettings({
          command: values.command,
          reponame: values.repo,
          branch: values.branch,
          minutes: values.minutes,
        })
      )
    },
    validateOnBlur: false,
  })
  useEffect(() => {
    formic.setValues({
      repo: settings.reponame,
      command: settings.command,
      branch: settings.branch,
      minutes: settings.minutes,
    })
  }, [settings])

  return (
    <DefaultLayout>
      <div className="settings">
        <h2 className="settings__header">Settings</h2>
        <p className="settings__subtitle">
          Configure repository connection and synchronization settings.
        </p>

        <form onSubmit={formic.handleSubmit} className="settings__form">
          <div className="settings__input">
            <InputWithLabel
              labelProps={{
                text: 'GitHub repository',
                requiredMark: true,
              }}
              inputProps={{
                clearable: true,
                onChange: (val) => {
                  formic.setFieldValue('repo', val)
                },
                showErrorMessages: true,
                error:
                  formic.touched.repo && formic.errors.repo
                    ? formic.errors.repo
                    : undefined,
                value: formic.values.repo,
                nativeAttrs: {
                  placeholder: 'user-name/repo-name',
                  name: 'repo',
                  onBlur: formic.handleBlur,
                },
              }}
            />
          </div>

          <div className="settings__input">
            <InputWithLabel
              labelProps={{
                text: 'Build command',
                requiredMark: true,
              }}
              inputProps={{
                showErrorMessages: true,
                error:
                  formic.touched.command && formic.errors.command
                    ? formic.errors.command
                    : undefined,
                onChange: (val) => {
                  formic.setFieldValue('command', val)
                },
                value: formic.values.command,
                clearable: true,
                nativeAttrs: {
                  placeholder: 'npm ci && npm run build',
                  name: 'command',
                  onBlur: formic.handleBlur,
                },
              }}
            />
          </div>

          <div className="settings__input">
            <InputWithLabel
              labelProps={{
                text: 'Main branch',
              }}
              inputProps={{
                onChange: (val) => {
                  formic.setFieldValue('branch', val)
                },
                value: formic.values.branch,
                clearable: true,
                nativeAttrs: {
                  placeholder: 'master',
                  name: 'branch',
                  onBlur: formic.handleBlur,
                },
              }}
            />
          </div>

          <div className="settings__input">
            <InputShort
              labelProps={{ text: 'Synchronize every', onLeft: true }}
              inputProps={{
                onChange: (val) => {
                  if (`${val}`.length <= 3) {
                    formic.setFieldValue('minutes', val)
                  }
                },
                value: formic.values.minutes,
                hideNumberArrows: true,
                nativeAttrs: {
                  type: 'number',
                  name: 'period',
                  onBlur: formic.handleBlur,
                },
              }}
              valName="minutes"
            ></InputShort>
          </div>

          <Button
            btnStyle="accent"
            className="settings__save"
            nativeAttrs={{
              type: 'submit',
            }}
          >
            Save
          </Button>

          <ButtonRouter
            path="/"
            buttonProps={{
              className: 'settings__cancel',
            }}
          >
            Cancel
          </ButtonRouter>
        </form>
      </div>
    </DefaultLayout>
  )
}
