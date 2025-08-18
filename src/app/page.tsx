import CarClustererMap from '@/components/map/car-clusterer-map';
import KakaoMapScript from '@/components/map/kakao-map-script';
import MapModal from '@/components/map/map-modal';
import StatusContainer from '@/components/status-box/status-container';
import { useState } from 'react';

export default function Home() {
  const [carStatusFilter, setCarStatusFilter] = useState<
    'total' | 'driving' | 'maintenance' | 'idle'
  >('total');

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  return (
    <>
      <div className="flex flex-row gap-6 p-4 h-full w-[98%] mx-auto">
        <div>
          <StatusContainer
            carStatusFilter={carStatusFilter}
            setCarStatusFilter={setCarStatusFilter}
          />
        </div>
        <div className="relative flex-1 max-h-[800px] mb-9 rounded-2xl overflow-hidden border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
          <KakaoMapScript />
          <CarClustererMap
            width="100%"
            height="100%"
            carStatusFilter={carStatusFilter}
            onOpenModal={() => setIsMapModalOpen(true)}
          />
        </div>
      </div>
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </>
  );
}
