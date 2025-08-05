'use client';

import CarClustererMap from '@/components/map/car-clusterer-map';
import KakaoMapScript from '@/components/map/kakao-map-script';
import MapModal from '@/components/map/map-modal';
import MenuBox from '@/components/menu-box/menu-box';
import StatusContainer from '@/components/status-box/status-container';
import TopBar from '@/components/ui/topBar';
import { useState } from 'react';

export default function Home() {
  const [carStatusFilter, setCarStatusFilter] = useState<
    'null' | '운행중' | '수리중' | '대기중'
  >('null');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-screen">
        <TopBar title="차량 관제 시스템"></TopBar>
        <div className="flex flex-col gap-4 p-4 h-full">
          <div>
            <StatusContainer
              carStatusFilter={carStatusFilter}
              setCarStatusFilter={setCarStatusFilter}
            />
          </div>
          <div className="flex flex-row gap-4 flex-1 px-4">
            <div className="flex-shrink-0">
              <MenuBox onOpenMapModal={() => setIsMapModalOpen(true)} />
            </div>
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
              <KakaoMapScript />
              <CarClustererMap
                width="100%"
                height="100%"
                carStatusFilter={carStatusFilter}
              />
            </div>
          </div>
        </div>
        <MapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
        />
      </div>
    </>
  );
}
