'use client';

import { useState } from 'react';
import CarClustererMap from './car-clusterer-map';
import KakaoMapScript from './kakao-map-script';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ isOpen, onClose }: MapModalProps) {
  const [carStatusFilter, setCarStatusFilter] = useState<
    'null' | '운행중' | '수리중' | '대기중'
  >('null');

  return (
    <div className="w-screen h-screen bg-black bg opacity-70 flex justify-center items-center">
      <div className="w-95vw h-95vh">
        <button
          onClick={onClose}
          className="w-10 h-10 z-[9999] bg-black bg-opacity-60 text-white border-none rounded-full cursor-pointer"
        >
          X
        </button>
        <KakaoMapScript />
        <CarClustererMap
          width="100%"
          height="100%"
          carStatusFilter={carStatusFilter}
        />
      </div>
    </div>
  );
}
