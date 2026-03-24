// Main entry point for the MWTech website
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SiteProvider } from './context/SiteContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteProvider>
      <App />
    </SiteProvider>
  </StrictMode>,
)
