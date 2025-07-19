import Link from 'next/link';
<<<<<<< HEAD
import TopBar from '../components/ui/topBar';
import UserBox from '../components/userBox/userBox';
import StatusBox from '../components/statusBox/statusBox';
import Map from '../components/map';
import styles from '../components/map.module.css';
=======
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';
import MenuBox from '@/components/menuBox/menuBox';
import Map from '@/components/map';
import KakaoMapScript from '@/components/KakaoMapScript';
>>>>>>> 188903e (카카오맵 API 구현 완료)

export default function Home({ children }: { children: React.ReactNode }) {
  return (
<<<<<<< HEAD
    <div>
=======

    <div className="flex flex-col h-screen">
<<<<<<< HEAD
      
>>>>>>> 3552754 (feat: carSearch input, 검색 버튼)
      <TopBar title="차량 관제 시스템"></TopBar>
      <StatusContainer />
      <MenuBox></MenuBox>
=======
>>>>>>> 188903e (카카오맵 API 구현 완료)

      <TopBar title="차량 관제 시스템"></TopBar>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gridTemplateRows: 'auto 1fr',
          gap: '16px',
          padding: '16px',
          height: '100%',
        }}
      >
        <div style={{ gridColumn: '1 / span 2' }}>
          <StatusContainer />
        </div>
        <div style={{ backgroundColor: '#f6f6f6', zIndex: 100, padding: '0px 60px 100px 15px' }}>
          <MenuBox />
        </div>
        <div style={{ position: 'relative', width: '98%', height: '500px' }}>
          <KakaoMapScript />
          <Map width="100%" height="100%" />
        </div>
      </div>
    </div >
  );
}
