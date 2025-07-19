import '../styles/globals.css';
import type { ReactNode } from 'react';
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';
import MenuBox from '@/components/menuBox/menuBox';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <TopBar title="차량 관제 시스템"></TopBar>
        <div style={{ margin: '0px 115px' }}>
          <div style={{ backgroundColor: '#f6f6f6', zIndex: 100, padding: '0px 15px 100px 15px', marginTop: '3px' }}>
            <UserBox />
            <StatusContainer />
            <MenuBox></MenuBox>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
} 