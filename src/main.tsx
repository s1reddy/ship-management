import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { initializeMockData } from './utils/mockData'

// Initialize mock data
try {
  initializeMockData();
  console.log('Mock data initialized successfully');
} catch (error) {
  console.error('Error initializing mock data:', error);
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
