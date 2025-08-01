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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]">
      <div className="relative w-[95vw] h-[95vh] bg-white rounded-[20px] overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[10000] bg-black bg-opacity-70 text-white border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer hover:bg-opacity-80 transition-all duration-200"
        >
          ✕
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
