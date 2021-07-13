import React, { FunctionComponent } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { ButtonRouter } from '../../components/ButtonRouter'
import { ReactComponent as NotFoundSvg } from '../../assets/settings-not-found.svg'
import './style.scss'

export const NoSettings: FunctionComponent = () => {
  return (
    <DefaultLayout>
      <div className="no-settings">
        <NotFoundSvg />

        <p className="no-settings__text">
          Configure repository connection
          <br /> and synchronization settings
        </p>

        <ButtonRouter
          path="/settings"
          buttonProps={{
            btnStyle: 'accent',
          }}
        >
          Open settings
        </ButtonRouter>
      </div>
    </DefaultLayout>
  )
}
