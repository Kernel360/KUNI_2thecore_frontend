'use client';

import { useEffect, useState, useRef } from 'react';
import Map from './map';

const ZOOM_THRESHOLD = 8;

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

        const handleZoomChanged = () => {
            const level = map.getLevel();
            if (level <= ZOOM_THRESHOLD) {
                const bounds = map.getBounds();
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();
                // TODO: API 호출 구현
                // fetch(`/api/cars?swLat=${sw.getLat()}&swLng=${sw.getLng()}&neLat=${ne.getLat()}&neLng=${ne.getLng()}`)
                //     .then(res => res.json())
                //     .then(data => setCars(data));

                // 임시 데이터로 테스트
                const dummyCars: Car[] = [
                    { car_number: '12가1234', status: '운행중', gps_latitude: '37.6106', gps_longitude: '126.998927' },
                    { car_number: '23나4567', status: '대기중', gps_latitude: '37.6126', gps_longitude: '127.001927' },
                    { car_number: '34다7890', status: '수리중', gps_latitude: '37.6086', gps_longitude: '126.996927' },
                ];
                setCars(dummyCars);

            } else {
                setCars([]);
            }
        };

        window.kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChanged);
        handleZoomChanged(); // 초기 로드 시 한 번 실행

        return () => {
            window.kakao.maps.event.removeListener(map, 'zoom_changed', handleZoomChanged);
        };
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