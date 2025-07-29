'use client';
import { useEffect, useRef } from 'react';

interface MapProps {
  width: string;
  height: string;
  onLoad?: (map: any) => void;
}

export default function Map({ width, height, onLoad }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.kakao &&
      window.kakao.maps &&
      mapRef.current
    ) {
      window.kakao.maps.load(() => {
        const mapContainer = mapRef.current;
        if (!mapContainer) return;

        const options = {
          center: new window.kakao.maps.LatLng(36.5, 127.8),
          level: 12,
        };
        const mapInstance = new window.kakao.maps.Map(mapContainer, options);
        if (onLoad) {
          onLoad(mapInstance);
        }
      });
    }
  }, [onLoad]);

  return (
    <div
      ref={mapRef}
      className="border border-gray-300 rounded-md mx-auto"
      style={{ width, height }}
    ></div>
  );
}
