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

export default function CarClustererMap({ width, height }: { width: string; height: string }) {
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
            { car_number: '12가1234', status: '운행중', gps_latitude: '37.5665', gps_longitude: '126.9780' }, // 서울시청
            { car_number: '23나2345', status: '대기중', gps_latitude: '37.5700', gps_longitude: '126.9830' }, // 경복궁
            { car_number: '34라3456', status: '수리중', gps_latitude: '37.5600', gps_longitude: '126.9950' }, // 남산
        ];
        setCars(dummyCars);
    }, [map]);

    useEffect(() => {
        if (!clustererRef.current) return;

        clustererRef.current.clear();

        const markers = cars
            .filter(car => statusToImage[car.status])
            .map(car => {
                const imageSrc = statusToImage[car.status]!;
                const imageSize = new window.kakao.maps.Size(32, 32);
                const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

                return new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(parseFloat(car.gps_latitude), parseFloat(car.gps_longitude)),
                    image: markerImage,
                    title: car.car_number
                });
            });

        clustererRef.current.addMarkers(markers);
    }, [cars]);

    return (
        <Map
            width={width}
            height={height}
            onLoad={setMap}
        />
    );
} 