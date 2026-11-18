import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/syne/700.css'
import '@fontsource/syne/800.css'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
