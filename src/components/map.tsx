'use client';
import { useEffect, useRef } from 'react';

interface MapProps {
  width: string;
  height: string;
}

export default function Map({ width, height }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(37.6106, 126.998927),
          level: 3,
        };
        new window.kakao.maps.Map(mapRef.current, options);
      });
    }
  }, []);

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
