import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './experience.css'
import App from './App'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
