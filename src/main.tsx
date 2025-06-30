import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import Footer from './components/Footer.tsx'
import Music from './pages/Music.tsx'

createRoot(document.getElementById('root') || document.createElement('div')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='lastfm' />
        <Route index element={<App />} />
        <Route path='music' element={<Music />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>
)
