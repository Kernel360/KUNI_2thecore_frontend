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
          level: 13,
          // center: new window.kakao.maps.LatLng(37.610600, 126.998927),
          // level: 3,
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
      style={{
        width,
        height,
        border: '1px solid #a7a7a7',
        borderRadius: '6px',
        margin: '10px auto',
      }}
    ></div>
  );
}
