import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import CSS files with absolute imports to ensure they're included in the build
import '/src/index.css'
import '/src/styles/lightMode.css' // Import light mode overrides
import '/src/styles/main.css' // Import main styles

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
