import './style.scss'
import React, { FC } from 'react'

export const Spinner: FC = () => {
  return (
    <div className="spinner">
      <div className="spinner__dot spinner__dot-1"></div>
      <div className="spinner__dot spinner__dot-2"></div>
      <div className="spinner__dot spinner__dot-3"></div>
    </div>
  )
}
