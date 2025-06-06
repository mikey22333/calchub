import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import CSS files with relative paths
import './index.css'
import './styles/lightMode.css' // Import light mode overrides
import './styles/main.css' // Import main styles

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
