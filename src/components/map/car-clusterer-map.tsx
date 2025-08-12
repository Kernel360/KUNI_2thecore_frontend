import { useGPXReader } from '@/hooks/use-gpx-reader';
import { CarService } from '@/services/car-service';
import { useEffect, useRef, useState } from 'react';
import Map from './map';

export interface Car {
  carNumber: string;
  status: '운행' | '대기' | '수리';
  lastLatitude: string;
  lastLongitude: string;
}

interface CarClustererMapProps {
  width: string;
  height: string;
  carStatusFilter: 'total' | '운행' | '대기' | '수리';
}

const statusToImage: { [key in Car['status']]?: string } = {
  운행: '/car_green.png',
  수리: '/car_red.png',
  대기: '/car_yellow.png',
};

export default function CarClustererMap({
  width,
  height,
  carStatusFilter,
}: CarClustererMapProps) {
  const [map, setMap] = useState<any>(null);
  const [runningCars, setRunningCars] = useState<Car[]>([]);
  const [staticCars, setStaticCars] = useState<Car[]>([]);
  const clustererRef = useRef<any>(null);

  // GPX 파일 목록
  const gpxFiles = [
    'daegu-to-gyeongju.gpx',
    'daejeon-to-jeonju.gpx',
    'euijeongbu-to-bucheon.gpx',
    'incheon-to-yongin.gpx',
    'mokpo-to-haenam.gpx',
    'namyangju-to-gimpo.gpx',
    'suncheon-to-yeosu.gpx',
    'wonju-to-chuncheon.gpx',
  ];

  // GPX 리더 훅 사용 - 운행 중인 차량만
  const { isReading, startReading, stopReading, loadedCars, currentBatch } =
    useGPXReader({
      gpxFiles,
      intervalMs: 1000,
      batchSize: 60,
      onBatchReady: async batch => {
        try {
          await CarService.sendCarLocationsBatch(batch);
          console.log('배치 데이터 전송 완료:', batch.length);

          // GPX에서 받아온 실시간 차량 위치 업데이트
          await loadRunningCarLocations();
        } catch (error) {
          console.error('배치 데이터 전송 실패:', error);
        }
      },
    });

  // 운행 중인 차량 위치 데이터 조회
  const loadRunningCarLocations = async () => {
    try {
      const locations = await CarService.getCarLocations();
      const carData: Car[] = locations.map(loc => ({
        carNumber: loc.carNumber,
        status: '운행',
        lastLatitude: loc.lastLatitude.toString(),
        lastLongitude: loc.lastLongitude.toString(),
      }));
      setRunningCars(carData);
    } catch (error) {
      console.error('운행 중인 차량 위치 데이터 조회 실패:', error);
    }
  };

  useEffect(() => {
    if (!map) return;

    clustererRef.current = new window.kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 10,
      disableClickZoom: true,
    });

    // GPX 시뮬레이션 시작 (페이지 로딩 시 한 번만)
    if (!isReading && loadedCars.length > 0) {
      startReading();
    }

    // 초기 운행 차량 위치 데이터 조회
    loadRunningCarLocations();
  }, [map, isReading, loadedCars.length, startReading]);

  useEffect(() => {
    if (!clustererRef.current) return;

    clustererRef.current.clear();

    // 모든 차량 데이터 합치기 (운행 중인 차량 + 정적 차량)
    const allCars = [...runningCars, ...staticCars];

    // 필터링
    let filteredCars: Car[];
    if (carStatusFilter === null) {
      filteredCars = allCars;
    } else {
      filteredCars = allCars.filter(car => car.status === carStatusFilter);
    }

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
  }, [runningCars, staticCars, carStatusFilter]);

  return (
    <div className="relative">
      {isReading && (
        <div className="absolute top-2 right-2 z-10 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          GPX 시뮬레이션 진행 중... ({loadedCars.length}대 차량)
        </div>
      )}
      <Map width={width} height={height} onLoad={setMap} />
    </div>
  );
}
