import React, { FunctionComponent } from 'react'
import './style.scss'

export const PageContainer: FunctionComponent = ({ children }) => {
  return <div className="page-container">{children}</div>
}
