import iconStyles from '@/components/icon-button/icon-button.module.css';
import { CarService } from '@/services/car-service';
import { useCallback, useEffect, useRef, useState } from 'react';
import Map, { Car } from './map';

interface CarClustererMapProps {
  width: string;
  height: string;
  carStatusFilter: 'total' | 'driving' | 'maintenance' | 'idle';
  onOpenModal?: () => void;
  isMapModalOpen?: boolean;
}

export default function CarClustererMap({
  width,
  height,
  carStatusFilter,
  onOpenModal,
  isMapModalOpen,
}: CarClustererMapProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);

  const loadCarLocations = useCallback(async () => {
    setLoading(true);
    try {
      // 현재 지도 bounds 가져오기
      let bounds;
      if (mapRef.current) {
        const mapBounds = mapRef.current.getBounds();
        const sw = mapBounds.getSouthWest();
        const ne = mapBounds.getNorthEast();
        bounds = {
          sw: { lat: sw.getLat(), lng: sw.getLng() },
          ne: { lat: ne.getLat(), lng: ne.getLng() }
        };
      }

      // bounds 기반으로 서버에서 필터링된 차량 데이터 요청
      const locations = await CarService.getCarLocations(bounds);
      const carData: Car[] = locations.map(loc => ({
        carNumber: loc.carNumber,
        status:
          loc.status === '운행'
            ? 'driving'
            : loc.status === '대기'
              ? 'idle'
              : 'maintenance', // '수리'
        lastLatitude: loc.lastLatitude,
        lastLongitude: loc.lastLongitude,
      }));
      setCars(carData);
    } catch (error) {
      console.error('차량 위치 데이터 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMapLoad = useCallback((mapInstance: any) => {
    mapRef.current = mapInstance;
    
    // 지도 로딩 완료 후 relayout 실행
    setTimeout(() => {
      mapInstance.relayout();
      loadCarLocations();
    }, 100);
  }, [loadCarLocations]);

  useEffect(() => {
    if (!mapRef.current) return;

    clustererRef.current = new window.kakao.maps.MarkerClusterer({
      map: mapRef.current,
      averageCenter: true,
      minLevel: 10,
      disableClickZoom: false,
    });

    // 클러스터 클릭 이벤트 리스너 추가
    window.kakao.maps.event.addListener(clustererRef.current, 'clusterclick', function (cluster: any) {
      mapRef.current.setLevel(mapRef.current.getLevel() - 1, {
        anchor: cluster.getCenter(),
        animate: { duration: 350 }
      });
    });
  }, [mapRef.current]);

  useEffect(() => {
    if (!clustererRef.current) return;

    clustererRef.current.clear();

    // 필터링
    const filteredCars = carStatusFilter === 'total' ? cars : cars.filter(car => car.status === carStatusFilter);
    
    const statusToImage = {
      driving: '/car_green.png',
      maintenance: '/car_red.png',
      idle: '/car_yellow.png',
    };

    const markers = filteredCars
      .filter(car => car.lastLatitude && car.lastLongitude)
      .map(car => {
        const markerImage = new window.kakao.maps.MarkerImage(
          statusToImage[car.status],
          new window.kakao.maps.Size(32, 32),
          { offset: new window.kakao.maps.Point(16, 32) }
        );

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            parseFloat(car.lastLatitude),
            parseFloat(car.lastLongitude)
          ),
          image: markerImage,
          title: car.carNumber,
        });

        // 마커 클릭 이벤트 추가
        window.kakao.maps.event.addListener(marker, 'click', function () {
          const position = marker.getPosition();
          // 애니메이션 없이 즉시 중심 이동 및 줌인
          mapRef.current.setCenter(position);
          mapRef.current.setLevel(3);
        });

        return marker;
      });

    clustererRef.current.addMarkers(markers);
  }, [cars, carStatusFilter]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <Map
        width={width}
        height={height}
        onLoad={handleMapLoad}
        onRefresh={loadCarLocations}
        enableAutoRefresh={true}
        zoomLevel={13}
      />
      {onOpenModal && !isMapModalOpen && (
        <button
          className={iconStyles.fullScreen}
          onClick={onOpenModal}
        ></button>
      )}
    </div>
  );
}
