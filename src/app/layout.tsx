import type { ReactNode } from 'react';
import '../styles/globals.css';

interface RootLayoutProps {
  children: ReactNode;
  title: string;
}

export default function RootLayout({ children, title }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto flex flex-col justify-center items-center w-full">
          <div
            style={{
              backgroundColor: '#f6f6f6',
              padding: '0px 10px 100px 10px',
              marginTop: '3px',
              width: '100%', // 추가
              height: '100%',
              maxWidth: '1290px', // 필요시 최대폭 제한
              maxHeight: '2000px',
              borderRadius: '10px',
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
