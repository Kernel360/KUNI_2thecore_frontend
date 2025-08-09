import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './styles/globals.css'

// Pages
import MainPage from './app/page.tsx'
import DetailPage from './app/detail/page.tsx'
import EmulatorPage from './app/emulator/page.tsx'
import HistoryPage from './app/history/page.tsx'
import LoginPage from './app/login/page.tsx'
import SearchPage from './app/search/page.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<MainPage />} />
          <Route path="detail" element={<DetailPage />} />
          <Route path="emulator" element={<EmulatorPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)