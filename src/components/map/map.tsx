import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './map.module.css';

export interface Car {
  carNumber: string;
  status: 'driving' | 'idle' | 'maintenance';
  lastLatitude: string;
  lastLongitude: string;
}

interface MapProps {
  width: string;
  height: string;
  onLoad?: (map: any) => void;
  onRefresh?: () => void;
  enableAutoRefresh?: boolean;
  cars?: Car[];
  carStatusFilter?: 'total' | 'driving' | 'maintenance' | 'idle';
  showMarkers?: boolean;
  zoomLevel?: number;
}

const statusToImage: { [key in Car['status']]?: string } = {
  driving: '/car_green.png',
  maintenance: '/car_red.png',
  idle: '/car_yellow.png',
};

export default function Map({
  width,
  height,
  onLoad,
  onRefresh,
  enableAutoRefresh = false,
  cars = [],
  carStatusFilter = 'total',
  showMarkers = false,
  zoomLevel = 13,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'skyview'>('roadmap');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(zoomLevel);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (mapInstance || !mapRef.current) return;

    // Kakao Maps 스크립트가 로드될 때까지 대기
    const checkKakaoMaps = () => {
      if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: new window.kakao.maps.LatLng(36.2, 128.1),
            level: zoomLevel,
          });

          map.setMaxLevel(13);
          window.kakao.maps.event.addListener(map, 'zoom_changed', () => setCurrentZoomLevel(map.getLevel()));
          
          setMapInstance(map);
          setTimeout(() => map.relayout(), 100);
          
          onLoad?.(map);
        });
      } else {
        // 스크립트가 아직 로드되지 않았으면 250ms 후 다시 시도
        setTimeout(checkKakaoMaps, 250);
      }
    };

    checkKakaoMaps();
  }, [zoomLevel, onLoad]);

  // 자동 갱신 로직
  useEffect(() => {
    if (!enableAutoRefresh || !onRefresh) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    // 줌 레벨에 따른 갱신 간격 결정 - 레벨 8 이하(확대)면 5초, 9 초과(축소)면 1분
    intervalRef.current = setInterval(onRefresh, currentZoomLevel <= 8 ? 5000 : 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enableAutoRefresh, onRefresh, currentZoomLevel]);


  // 마커 렌더링
  useEffect(() => {
    if (!mapInstance || !showMarkers) return;

    // 기존 마커들 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 필터링된 차량들
    const filteredCars = carStatusFilter === 'total' ? cars : cars.filter(car => car.status === carStatusFilter);

    markersRef.current = filteredCars
      .filter(car => statusToImage[car.status])
      .map(car => {
        const markerImage = new window.kakao.maps.MarkerImage(
          statusToImage[car.status]!,
          new window.kakao.maps.Size(32, 32),
          { offset: new window.kakao.maps.Point(16, 32) }
        );

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(parseFloat(car.lastLatitude), parseFloat(car.lastLongitude)),
          image: markerImage,
          title: car.carNumber,
        });

        marker.setMap(mapInstance);
        return marker;
      });
  }, [mapInstance, cars, carStatusFilter, showMarkers]);

  // 지도 이동 시 bounds 기반 데이터 새로고침 (onRefresh 콜백 호출)
  useEffect(() => {
    if (!mapInstance || !showMarkers || !onRefresh) return;

    const handleMapMove = () => setTimeout(onRefresh, 300);

    window.kakao.maps.event.addListener(mapInstance, 'bounds_changed', handleMapMove);
    window.kakao.maps.event.addListener(mapInstance, 'zoom_changed', handleMapMove);

    return () => {
      window.kakao.maps.event.removeListener(mapInstance, 'bounds_changed', handleMapMove);
      window.kakao.maps.event.removeListener(mapInstance, 'zoom_changed', handleMapMove);
    };
  }, [mapInstance, showMarkers, onRefresh]);

  // 페이지 재진입 시 지도 리사이즈
  useEffect(() => {
    if (!mapInstance) return;

    const handleResize = () => mapInstance.relayout();
    const handleVisibilityChange = () => {
      if (!document.hidden) setTimeout(() => mapInstance.relayout(), 100);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    setTimeout(() => mapInstance.relayout(), 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mapInstance]);

  const setMapTypeHandler = useCallback((type: 'roadmap' | 'skyview') => {
    if (!mapInstance) return;
    mapInstance.setMapTypeId(type === 'roadmap' ? window.kakao.maps.MapTypeId.ROADMAP : window.kakao.maps.MapTypeId.SKYVIEW);
    setMapType(type);
  }, [mapInstance]);

  const zoomIn = useCallback(() => mapInstance?.setLevel(mapInstance.getLevel() - 1), [mapInstance]);
  const zoomOut = useCallback(() => mapInstance?.setLevel(mapInstance.getLevel() + 1), [mapInstance]);

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
