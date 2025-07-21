import '../styles/globals.css';
import type { ReactNode } from 'react';
import KakaoMapScript from '../components/KakaoMapScript';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <KakaoMapScript />
      </head>
      <body>{children}</body>
    </html>
  );
} 