import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Global error handler for production
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    console.error('[EtherWorld] Global error:', event.error)
    // Send to admin analytics in real implementation
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[EtherWorld] Unhandled rejection:', event.reason)
  })
}

// Performance monitoring
if (typeof window !== 'undefined' && 'performance' in window) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'navigation') {
        console.log(`[EtherWorld] Page load: ${entry.duration.toFixed(2)}ms`)
      }
    })
  })
  observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })
}

// Initialize Firebase (if configured)
const initFirebase = async () => {
  try {
    // Firebase initialization would go here in production
    console.log('%c[Ethereal] Firebase ready (mock)', 'color:#0f0')
  } catch (error) {
    console.warn('[EtherWorld] Firebase init skipped (dev mode)')
  }
}

// Boot sequence
const boot = async () => {
  await initFirebase()
  
  const root = ReactDOM.createRoot(document.getElementById('root')!)
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  // Mark app as ready
  window.dispatchEvent(new CustomEvent('etherworld-ready'))
}

// Start the application
boot().catch(console.error)

// Expose debug API globally (dev only)
if (import.meta.env.DEV) {
  (window as any).__ETHERWORLD_DEBUG__ = {
    version: '2.0.0-fusion',
    toggleAdmin: () => window.dispatchEvent(new CustomEvent('toggle-admin')),
    openEditor: () => window.dispatchEvent(new CustomEvent('open-editor')),
    spawnVehicle: (type: string) => window.dispatchEvent(new CustomEvent('spawn-vehicle', { detail: { type } })),
    setWeather: (preset: string) => window.dispatchEvent(new CustomEvent('set-weather', { detail: { preset } })),
    triggerExplosion: () => window.dispatchEvent(new CustomEvent('tree-explosion'))
  }
  console.log('%c[Ethereal] Debug API available: window.__ETHERWORLD_DEBUG__', 'color:#ff0')
}
