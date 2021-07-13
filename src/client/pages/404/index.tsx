import React, { FunctionComponent } from 'react'
import { DefaultLayout } from '../../layouts/Default'
import { ButtonRouter } from '../../components/ButtonRouter'
import './style.scss'

export const NotFound: FunctionComponent = () => {
  return (
    <DefaultLayout>
      <div className="not-fount">
        <p className="not-fount__text">Page not found</p>

        <ButtonRouter
          path="/"
          buttonProps={{
            btnStyle: 'accent',
          }}
        >
          Home
        </ButtonRouter>
      </div>
    </DefaultLayout>
  )
}
