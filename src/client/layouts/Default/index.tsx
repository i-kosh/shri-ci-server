import React, { FunctionComponent, ReactNode } from 'react'
import { PageContainer } from '../../components/PageContainer'
import { ButtonRouter } from '../../components/ButtonRouter'
import { useRouteMatch } from 'react-router-dom'
import classNames from 'classnames'
import './style.scss'
import { ReactComponent as CogSvg } from '../../assets/cog.svg'

export interface DefaultLayoutProps {
  title?: string
  addButtons?: ReactNode
}

export const DefaultLayout: FunctionComponent<DefaultLayoutProps> = ({
  children,
  title,
  addButtons,
}) => {
  const headerTitle = title || 'Scool CI Server'

  const titleClasses = classNames({
    'page__header-title': true,
    'page__header-title--dimm': !title,
  })

  const settingsRoute = useRouteMatch('/settings')

  const settingsButton = !settingsRoute && (
    <div>
      <ButtonRouter
        path="/settings"
        buttonProps={{
          size: 'xs',
          nativeAttrs: {
            title: 'Settings',
          },
        }}
      >
        <CogSvg />
      </ButtonRouter>
    </div>
  )

  return (
    <div className="page">
      <header>
        <PageContainer>
          <div className="page__header">
            <h1 className={titleClasses}>{headerTitle}</h1>

            <div className="page__buttons">
              {addButtons}
              {settingsButton}
            </div>
          </div>
        </PageContainer>
      </header>

      <main className="page__main">
        <PageContainer>{children}</PageContainer>
      </main>

      <footer className="page__footer">
        <PageContainer>
          <div className="page__footer-content">
            <ul className="page__footer-nav footer-nav">
              <li>
                <a href="#" className="footer-link">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Learning
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Русская версия
                </a>
              </li>
            </ul>

            <span className="page__footer-copy footer-copy">
              © 2021 Igor Koshelev
            </span>
          </div>
        </PageContainer>
      </footer>
    </div>
  )
}
