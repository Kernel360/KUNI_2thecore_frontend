'use client';

import { useEffect, useState, useRef } from 'react';
import Map from './map';

export interface Car {
    car_number: string;
    status: 'null' | '운행중' | '대기중' | '수리중';
    gps_latitude: string;
    gps_longitude: string;
}

const statusToImage: { [key in Car['status']]?: string } = {
    '운행중': '/car_green.png',
    '수리중': '/car_red.png',
    '대기중': '/car_yellow.png',
};

export default function CarClustererMap({ width, height, carStatusFilter }: { width: string; height: string; carStatusFilter: 'null' | '운행중' | '수리중' | '대기중' }) {
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

        const dummyCars: Car[] = [
            { car_number: '12가1234', status: '운행중', gps_latitude: '37.5665', gps_longitude: '126.9780' }, // 서울
            { car_number: '23나2345', status: '대기중', gps_latitude: '35.1796', gps_longitude: '129.0756' }, // 부산
            { car_number: '34다3456', status: '수리중', gps_latitude: '35.8714', gps_longitude: '128.6014' }, // 대구
            { car_number: '45라4567', status: '운행중', gps_latitude: '37.4563', gps_longitude: '126.7052' }, // 인천
            { car_number: '56마5678', status: '대기중', gps_latitude: '35.1595', gps_longitude: '126.8526' }, // 광주
            { car_number: '67바6789', status: '수리중', gps_latitude: '36.3504', gps_longitude: '127.3845' }, // 대전
            { car_number: '78사7890', status: '운행중', gps_latitude: '35.5384', gps_longitude: '129.3114' }, // 울산
            { car_number: '89아8901', status: '대기중', gps_latitude: '33.4996', gps_longitude: '126.5312' }, // 제주
        ];
        setCars(dummyCars);
    }, [map]);

    useEffect(() => {
        if (!clustererRef.current) return;

        clustererRef.current.clear();

        const filteredCars = carStatusFilter === 'null'
            ? cars
            : cars.filter(car => car.status === carStatusFilter);

        const markers = filteredCars
            .filter(car => statusToImage[car.status])
            .map(car => {
                const imageSrc = statusToImage[car.status]!;
                const imageSize = new window.kakao.maps.Size(32, 32);
                const imageOption = { offset: new window.kakao.maps.Point(16, 32) };
                const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

                return new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(parseFloat(car.gps_latitude), parseFloat(car.gps_longitude)),
                    image: markerImage,
                    title: car.car_number
                });
            });

        clustererRef.current.addMarkers(markers);
    }, [cars, carStatusFilter]);

    return (
        <Map
            width={width}
            height={height}
            onLoad={setMap}
        />
    );
} 