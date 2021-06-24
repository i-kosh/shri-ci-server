import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './scss/index.scss'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { ToastDock } from './components/ToastBox'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ScrollToTop />
        <ToastDock>
          <App />
        </ToastDock>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
