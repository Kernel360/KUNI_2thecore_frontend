import '../styles/globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <Script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
} 