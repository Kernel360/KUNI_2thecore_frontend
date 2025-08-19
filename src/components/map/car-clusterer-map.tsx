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
    
    // 지도가 준비되면 1초 후에 차량 데이터 로드 (지연 로딩)
    setTimeout(() => {
      loadCarLocations();
    }, 1000);
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

  useEffect(() => {
    if (!clustererRef.current) return;

    clustererRef.current.clear();

    // 필터링
    const filteredCars =
      carStatusFilter === 'total'
        ? cars
        : cars.filter(car => car.status === carStatusFilter);
    const markers = filteredCars
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
  }, [cars, carStatusFilter]);

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
