'use client';

import { useEffect, useState, useRef } from 'react';
import { CarService } from '@/services/car-service';
import Map from './map';

export interface Car {
  carNumber: string;
  status: '운행중' | '대기중' | '수리중';
  gpsLatitude: string;
  gpsLongitude: string;
}

const statusToImage: { [key in Car['status']]?: string } = {
  운행중: '/car_green.png',
  수리중: '/car_red.png',
  대기중: '/car_yellow.png',
};

export default function CarClustererMap({ width, height, carStatusFilter }: { width: string; height: string; carStatusFilter: '운행중' | '수리중' | '대기중' }) {
  const [map, setMap] = useState<any>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const clustererRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    clustererRef.current = new window.kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 10,
      disableClickZoom: true,
    });

    const fetchCars = async () => {
      try {
        const carData = await CarService.getAllCars(1, 100); // 첫 번째 페이지, 100개
        const carsWithGPS = carData.content
          .filter(car => car.gpsLatitude && car.gpsLongitude)
          .map(car => ({
            carNumber: car.carNumber,
            status: car.status,
            gpsLatitude: car.gpsLatitude?.toString() || '0',
            gpsLongitude: car.gpsLongitude?.toString() || '0',
          }));
        setCars(carsWithGPS);
      } catch (error) {
        console.error('차량 데이터 조회 실패:', error);
        // 에러 발생 시 더미 데이터 사용
        const fallbackCars: Car[] = [
          { carNumber: '12가1234', status: '운행중', gpsLatitude: '37.5665', gpsLongitude: '126.9780' },
          { carNumber: '23나2345', status: '대기중', gpsLatitude: '35.1796', gpsLongitude: '129.0756' },
          { carNumber: '34다3456', status: '수리중', gpsLatitude: '35.8714', gpsLongitude: '128.6014' },
          { carNumber: '45라4567', status: '운행중', gpsLatitude: '37.4563', gpsLongitude: '126.7052' },
          { carNumber: '56마5678', status: '대기중', gpsLatitude: '35.1595', gpsLongitude: '126.8526' },
          { carNumber: '67바6789', status: '수리중', gpsLatitude: '36.3504', gpsLongitude: '127.3845' },
          { carNumber: '78사7890', status: '운행중', gpsLatitude: '35.5384', gpsLongitude: '129.3114' },
          { carNumber: '89아8901', status: '대기중', gpsLatitude: '33.4996', gpsLongitude: '126.5312' },
        ];
        setCars(fallbackCars);
      }
    };

    fetchCars();
  }, [map]);

  useEffect(() => {
    if (!clustererRef.current) return;

    clustererRef.current.clear();

    const filteredCars =
      carStatusFilter === '운행중'
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
            parseFloat(car.gpsLatitude),
            parseFloat(car.gpsLongitude)
          ),
          image: markerImage,
          title: car.carNumber,
        });
      });

    clustererRef.current.addMarkers(markers);
  }, [cars, carStatusFilter]);

  return <Map width={width} height={height} onLoad={setMap} />;
}
