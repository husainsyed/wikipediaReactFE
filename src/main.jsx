import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css';
import "@fontsource/open-sans";



createRoot(document.getElementById('root')).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
)
