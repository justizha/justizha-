import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import Page from './pages/Page.tsx'
import Footer from './components/Footer.tsx'

createRoot(document.getElementById('root') || document.createElement('div')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path='/page' element={<Page />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
)
