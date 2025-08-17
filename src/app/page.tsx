import CarClustererMap from '@/components/map/car-clusterer-map';
import KakaoMapScript from '@/components/map/kakao-map-script';
import MapModal from '@/components/map/map-modal';
import MenuBox from '@/components/menu-box/menu-box';
import StatusContainer from '@/components/status-box/status-container';
import TopBar from '@/components/ui/topBar';
import { useState } from 'react';

export default function Home() {
  const [carStatusFilter, setCarStatusFilter] = useState<
    'total' | 'driving' | 'maintenance' | 'idle'
  >('total');

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  localStorage.setItem('loginId', 'dev');
  localStorage.setItem(
    'accessToken',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZXYiLCJsb2dpbklkIjoiZGV2IiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTc1NTMyODg1MSwiZXhwIjoxNzU1MzI5NDUxfQ.ehnzwZvMmDzjNL399ZAI6PnbCqsnOV0nKa_CKc9a3w8'
  );

  return (
    <>
      <div className="flex flex-col h-screen">
        <TopBar showLogo={true}></TopBar>
        <MenuBox onOpenMapModal={() => setIsMapModalOpen(true)} />
        <div className="flex flex-row gap-6 p-4 h-full w-[98%] mx-auto">
          <div>
            <StatusContainer
              carStatusFilter={carStatusFilter}
              setCarStatusFilter={setCarStatusFilter}
            />
          </div>
          <div className="relative flex-1 max-h-[1000px] mb-9 rounded-2xl overflow-hidden border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
            <KakaoMapScript />
            <CarClustererMap
              width="100%"
              height="100%"
              carStatusFilter={carStatusFilter}
            />
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

