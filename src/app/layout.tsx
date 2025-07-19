import '../styles/globals.css';
import type { ReactNode } from 'react';
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';
import MenuBox from '@/components/menuBox/menuBox';
import Script from 'next/script';

interface RootLayoutProps {
  children: ReactNode;
  title: string;
}

export default function RootLayout({ children, title }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <div
          style={{
            margin: '0px 115px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%', // 추가
          }}
        >
          <div
            style={{
              backgroundColor: '#f6f6f6',
              padding: '0px 15px 100px 15px',
              marginTop: '3px',
              width: '100%', // 추가
              maxWidth: '1230px', // 필요시 최대폭 제한
            }}
          >
            <UserBox />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
} 