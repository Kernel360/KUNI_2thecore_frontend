'use client';

import CarClustererMap from '@/components/map/car-clusterer-map';
import KakaoMapScript from '@/components/map/kakao-map-script';
import MenuBox from '@/components/menu-box/menu-box';
import StatusContainer from '@/components/status-box/status-container';
import TopBar from '@/components/ui/topBar';
import { useState } from 'react';

export default function Home() {
  const [carStatusFilter, setCarStatusFilter] = useState<
    'null' | '운행중' | '수리중' | '대기중'
  >('null');
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
          <StatusContainer
            carStatusFilter={carStatusFilter}
            setCarStatusFilter={setCarStatusFilter}
          />
        </div>
        <div
          style={{
            backgroundColor: '#f6f6f6',
            zIndex: 100,
            padding: '0px 60px 0px 15px',
          }}
        >
          <MenuBox />
        </div>
        <div style={{ position: 'relative', width: '98%', height: '500px' }}>
          <KakaoMapScript />
          <CarClustererMap
            width="100%"
            height="100%"
            carStatusFilter={carStatusFilter}
          />
        </div>
      </div>
    </div>
  );
}
