'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './map.module.css';

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
    <div className={styles.map_wrap} style={{ width, height }}>
      <div
        ref={mapRef}
        className="w-full h-full relative overflow-hidden"
      ></div>

      {/* 지도타입 컨트롤 */}
      <div className={`${styles.custom_typecontrol} ${styles.radius_border}`}>
        <span
          className={mapType === 'roadmap' ? styles.selected_btn : styles.btn}
          onClick={() => setMapTypeHandler('roadmap')}
        >
          지도
        </span>
        <span
          className={mapType === 'skyview' ? styles.selected_btn : styles.btn}
          onClick={() => setMapTypeHandler('skyview')}
        >
          스카이뷰
        </span>
      </div>

      {/* 지도 확대, 축소 컨트롤 */}
      <div className={`${styles.custom_zoomcontrol} ${styles.radius_border}`}>
        <span onClick={zoomIn}>
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png"
            alt="확대"
          />
        </span>
        <span onClick={zoomOut}>
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png"
            alt="축소"
          />
        </span>
      </div>
    </div>
  );
}
