import Link from 'next/link';
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';
import MenuBox from '@/components/menuBox/menuBox';
import CarClustererMap from '@/components/map/CarClustererMap';
import KakaoMapScript from '@/components/map/KakaoMapScript';

export default function Home() {
  return (

    <div className="flex flex-col h-screen">

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
          <CarClustererMap width="100%" height="100%" />
        </div>
      </div>
    </div>
  );
}