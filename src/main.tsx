import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import './styles/globals.css';

// Pages
import DetailPage from './app/detail/page.tsx';
import EmulatorPage from './app/emulator/page.tsx';
import HistoryPage from './app/history/page.tsx';
import LoginPage from './app/login/page.tsx';
import MainPage from './app/page.tsx';
import SearchPage from './app/search/page.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 - 보호되지 않음 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 보호된 라우트들 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        >
          <Route index element={<MainPage />} />
          <Route path="detail" element={<DetailPage />} />
          <Route path="emulator" element={<EmulatorPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
