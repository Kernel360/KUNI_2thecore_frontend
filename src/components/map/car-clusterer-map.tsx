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

      // 전체 차량 데이터 요청 (서버에서 bounds 필터링 미지원)
      const locations = await CarService.getCarLocations();
      // 클라이언트에서 bounds 내의 차량만 필터링
      const filteredLocations = bounds 
        ? locations.filter(loc => {
            const lat = parseFloat(loc.lastLatitude);
            const lng = parseFloat(loc.lastLongitude);
            return lat >= bounds.sw.lat && lat <= bounds.ne.lat &&
                   lng >= bounds.sw.lng && lng <= bounds.ne.lng;
          })
        : locations;

      const carData: Car[] = filteredLocations.map(loc => ({
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

      // 대기/수리 차량은 기존 데이터 유지, 운행 차량만 업데이트
      setCars(prevCars => {
        const updatedCars = [...carData];
        
        // 현재 시간과 마지막 업데이트 시간 비교
        const now = Date.now();
        const oneMinute = 60000;
        
        prevCars.forEach(prevCar => {
          if (prevCar.status === 'idle' || prevCar.status === 'maintenance') {
            const lastUpdate = (prevCar as any).lastUpdate || 0;
            if (now - lastUpdate < oneMinute) {
              // 1분이 지나지 않았으면 기존 데이터 유지
              const existingCarIndex = updatedCars.findIndex(car => car.carNumber === prevCar.carNumber);
              if (existingCarIndex >= 0) {
                updatedCars[existingCarIndex] = prevCar;
              }
            } else {
              // 1분이 지났으면 새 데이터에 업데이트 시간 추가
              const newCarIndex = updatedCars.findIndex(car => car.carNumber === prevCar.carNumber);
              if (newCarIndex >= 0) {
                (updatedCars[newCarIndex] as any).lastUpdate = now;
              }
            }
          }
        });

        // 운행 중인 차량은 항상 최신 데이터로 업데이트
        updatedCars.forEach(car => {
          if (car.status === 'driving') {
            (car as any).lastUpdate = now;
          }
        });

        return updatedCars;
      });
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
          // 줌인과 중심 이동을 동시에 수행
          mapRef.current.setLevel(3, {
            anchor: position,
            animate: { duration: 500 }
          });
          
          // 애니메이션 완료 후 중심 재조정
          setTimeout(() => {
            mapRef.current.setCenter(position);
          }, 600);
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
