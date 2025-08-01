'use client';
import { useEffect, useRef, useState } from 'react';

interface MapProps {
  width: string;
  height: string;
  onLoad?: (map: any) => void;
}

export default function Map({ width, height, onLoad }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'skyview'>('roadmap');

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
        const map = new window.kakao.maps.Map(mapContainer, options);
        setMapInstance(map);
        if (onLoad) {
          onLoad(map);
        }
      });
    }
  }, [onLoad]);

  const setMapTypeHandler = (type: 'roadmap' | 'skyview') => {
    if (!mapInstance) return;

    if (type === 'roadmap') {
      mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
    } else {
      mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
    }
    setMapType(type);
  };

  const zoomIn = () => {
    if (!mapInstance) return;
    mapInstance.setLevel(mapInstance.getLevel() - 1);
  };

  const zoomOut = () => {
    if (!mapInstance) return;
    mapInstance.setLevel(mapInstance.getLevel() + 1);
  };

  return (
    <div className="relative" style={{ width, height }}>
      <div
        ref={mapRef}
        className="border border-gray-300 rounded-md mx-auto w-full h-full"
      ></div>
    </div>
  );
}
