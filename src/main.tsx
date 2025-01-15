import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/base.css'
import './styles/app.css'
import './styles/wheel.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)