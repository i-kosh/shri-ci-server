import React, { FunctionComponent } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { InputWithLabel } from '../../components/InputWithLabel'
import { InputShort } from '../../components/InputShort'
import { Button } from '../../components/Button'
import { ButtonRouter } from '../../components/ButtonRouter'
import { useFormik } from 'formik'
import './style.scss'

export const SettingsPage: FunctionComponent = () => {
  const formic = useFormik({
    initialValues: {
      repo: '',
      command: '',
      branch: '',
      minutes: '',
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
      console.log('submit')
      console.log(values)
    },
    validateOnBlur: false,
  })

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
