import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './map.module.css';

interface MapProps {
  width: string;
  height: string;
  onLoad?: (map: any) => void;
  onRefresh?: () => void;
  enableAutoRefresh?: boolean;
}

export default function Map({ width, height, onLoad, onRefresh, enableAutoRefresh = false }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'skyview'>('roadmap');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(13);

  useEffect(() => {
    if (mapInstance || !mapRef.current) return;

    // Kakao Maps 스크립트가 로드될 때까지 대기
    const checkKakaoMaps = () => {
      if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const options = {
            center: new window.kakao.maps.LatLng(36.2,128.1),
            level:13,
          };

          const map = new window.kakao.maps.Map(mapRef.current, options);

          map.setMaxLevel(13);

          // 줌 레벨 변경 이벤트 리스너 추가
          window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
            const level = map.getLevel();
            setCurrentZoomLevel(level);
          });

          setMapInstance(map);

          if (onLoad) {
            onLoad(map);
          }
        });
      } else {
        // 스크립트가 아직 로드되지 않았으면 100ms 후 다시 시도
        setTimeout(checkKakaoMaps, 100);
      }
    };

    checkKakaoMaps();
  }, []);

  // 자동 갱신 로직
  const setupAutoRefresh = useCallback(() => {
    if (!enableAutoRefresh || !onRefresh) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 줌 레벨에 따른 갱신 간격 결정
    // 레벨 8 이하(확대)면 5초, 9 초과(축소)면 1분
    const refreshInterval = currentZoomLevel <= 8 ? 5000 : 60000;

    intervalRef.current = setInterval(() => {
      onRefresh();
    }, refreshInterval);
  }, [enableAutoRefresh, onRefresh, currentZoomLevel]);

  useEffect(() => {
    setupAutoRefresh();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [setupAutoRefresh]);

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
