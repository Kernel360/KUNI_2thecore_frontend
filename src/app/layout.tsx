import '../styles/globals.css';
import type { ReactNode } from 'react';
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';
import MenuBox from '@/components/menuBox/menuBox';

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
            margin: '0px auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%', // 추가
          }}
        >
          <div
            style={{
              backgroundColor: '#f6f6f6',
              padding: '0px 10px 100px 10px',
              marginTop: '3px',
              width: '100%', // 추가
              maxWidth: '1290px', // 필요시 최대폭 제한
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