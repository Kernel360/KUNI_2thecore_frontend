import iconStyles from '@/components/icon-button/icon-button.module.css';
import { CarService } from '@/services/car-service';
import { useCallback, useEffect, useRef, useState } from 'react';
import Map from './map';

export interface Car {
  carNumber: string;
  status: 'driving' | 'idle' | 'maintenance';
  lastLatitude: string;
  lastLongitude: string;
}

interface CarClustererMapProps {
  width: string;
  height: string;
  carStatusFilter: 'total' | 'driving' | 'maintenance' | 'idle';
  onOpenModal?: () => void;
  isMapModalOpen?: boolean;
}

const statusToImage: { [key in Car['status']]?: string } = {
  driving: '/car_green.png',
  maintenance: '/car_red.png',
  idle: '/car_yellow.png',
};

export default function CarClustererMap({
  width,
  height,
  carStatusFilter,
  onOpenModal,
  isMapModalOpen,
}: CarClustererMapProps) {
  const [map, setMap] = useState<any>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);

  const handleMapLoad = (mapInstance: any) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
    setMapReady(true);

    // 지도 타일 로딩 완료 후 차량 데이터 로드 (지연 로딩)
    // tilesloaded 이벤트로 지도 완전 로딩 대기
    const loadCarsAfterTiles = () => {
      window.kakao.maps.event.addListener(mapInstance, 'tilesloaded', () => {
        setTimeout(() => {
          loadCarLocations();
        }, 500);
      });
    };

    // 이미 타일이 로딩된 경우 즉시 실행, 아니면 이벤트 대기
    if (mapInstance.getLevel() !== undefined) {
      setTimeout(() => {
        loadCarLocations();
      }, 500);
    } else {
      loadCarsAfterTiles();
    }
  };

  const loadCarLocations = useCallback(async () => {
    setLoading(true);
    try {
      const locations = await CarService.getCarLocations();
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

  useEffect(() => {
    if (!map) return;

    clustererRef.current = new window.kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 10,
      disableClickZoom: true,
    });
  }, [map]);

  // 마커 가상화를 위한 지도 bounds 계산
  const getVisibleCars = useCallback(
    (allCars: Car[]) => {
      if (!map) return allCars;

      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      return allCars.filter(car => {
        const lat = parseFloat(car.lastLatitude);
        const lng = parseFloat(car.lastLongitude);

        return (
          lat >= sw.getLat() &&
          lat <= ne.getLat() &&
          lng >= sw.getLng() &&
          lng <= ne.getLng()
        );
      });
    },
    [map]
  );

  useEffect(() => {
    if (!clustererRef.current) return;

    clustererRef.current.clear();

    // 필터링
    const filteredCars =
      carStatusFilter === 'total'
        ? cars
        : cars.filter(car => car.status === carStatusFilter);

    // 마커 가상화: 화면에 보이는 차량만 렌더링
    const visibleCars = getVisibleCars(filteredCars);

    const markers = visibleCars
      .filter(car => statusToImage[car.status])
      .map(car => {
        const imageSrc = statusToImage[car.status]!;
        const imageSize = new window.kakao.maps.Size(32, 32);
        const imageOption = { offset: new window.kakao.maps.Point(16, 32) };
        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        return new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            parseFloat(car.lastLatitude),
            parseFloat(car.lastLongitude)
          ),
          image: markerImage,
          title: car.carNumber,
        });
      });

    clustererRef.current.addMarkers(markers);
  }, [cars, carStatusFilter, getVisibleCars]);

  // 지도 이동 시 마커 재렌더링
  useEffect(() => {
    if (!map) return;
    // 지도 디바운스
    const handleMapMove = () => {
      // 디바운스를 위한 타이머
      const timer = setTimeout(() => {
        if (cars.length > 0) {
          // 마커 업데이트 트리거
          const filteredCars =
            carStatusFilter === 'total'
              ? cars
              : cars.filter(car => car.status === carStatusFilter);
          const visibleCars = getVisibleCars(filteredCars);

          clustererRef.current?.clear();
          const markers = visibleCars
            .filter(car => statusToImage[car.status])
            .map(car => {
              const imageSrc = statusToImage[car.status]!;
              const imageSize = new window.kakao.maps.Size(32, 32);
              const imageOption = {
                offset: new window.kakao.maps.Point(16, 32), //마커 이미지의 기준점(중앙, 하단)
              };
              const markerImage = new window.kakao.maps.MarkerImage(
                imageSrc,
                imageSize,
                imageOption
              );
              return new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(
                  parseFloat(car.lastLatitude),
                  parseFloat(car.lastLongitude)
                ),
                image: markerImage,
                title: car.carNumber, //마우스 오버 시 차량 번호
              });
            });
          clustererRef.current?.addMarkers(markers);
        }
      }, 300);

      return () => clearTimeout(timer);
    };

    window.kakao.maps.event.addListener(map, 'bounds_changed', handleMapMove);
    window.kakao.maps.event.addListener(map, 'zoom_changed', handleMapMove);

    return () => {
      window.kakao.maps.event.removeListener(
        map,
        'bounds_changed',
        handleMapMove
      );
      window.kakao.maps.event.removeListener(
        map,
        'zoom_changed',
        handleMapMove
      );
    };
  }, [map, cars, carStatusFilter, getVisibleCars]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <Map
        width={width}
        height={height}
        onLoad={handleMapLoad}
        onRefresh={loadCarLocations}
        enableAutoRefresh={true}
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
