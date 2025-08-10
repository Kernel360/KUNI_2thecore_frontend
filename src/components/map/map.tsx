
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
    console.log('Map useEffect triggered');
    console.log('window.kakao exists:', !!window.kakao);
    console.log('window.kakao.maps exists:', !!window.kakao?.maps);
    console.log('mapRef.current exists:', !!mapRef.current);
    
    if (
      typeof window !== 'undefined' &&
      window.kakao &&
      window.kakao.maps &&
      mapRef.current
    ) {
      console.log('Attempting to load kakao map...');
      window.kakao.maps.load(() => {
        console.log('Kakao maps loaded, creating map instance...');
        const mapContainer = mapRef.current;
        if (!mapContainer) {
          console.log('Map container not found');
          return;
        }

        const options = {
          center: new window.kakao.maps.LatLng(36.5, 127.8),
          level: 12,
        };
        console.log('Creating map with options:', options);
        const map = new window.kakao.maps.Map(mapContainer, options);
        console.log('Map created successfully:', !!map);
        setMapInstance(map);
        if (onLoad) {
          onLoad(map);
        }
      });
    } else {
      console.log('Kakao maps prerequisites not met');
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
      <div
        className={`${styles.custom_typecontrol} ${styles.radius_border}`}
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
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
      <div
        className={`${styles.custom_zoomcontrol} ${styles.radius_border}`}
        style={{
          position: 'absolute',
          top: '50px',
          right: '10px',
          zIndex: 9999,
          backgroundColor: '#f5f5f5',
          border: '1px solid #919191',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <span
          onClick={zoomIn}
          style={{
            display: 'block',
            width: '36px',
            height: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '40px',
            color: '#333',
          }}
        >
          +
        </span>
        <span
          onClick={zoomOut}
          style={{
            display: 'block',
            width: '36px',
            height: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            borderTop: '1px solid #bfbfbf',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '40px',
            color: '#333',
          }}
        >
          −
        </span>
      </div>
    </div>
  );
}
