import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store'
import ThemeProvider from './context/ThemeProvider'
import { AuthProvider } from './context/AuthContext'
import { ErrorBoundary } from './components/common'
import App from './App.tsx'
import './styles/global.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <ThemeProvider>
            <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
)
