'use client';
import { useEffect, useRef } from 'react';
<<<<<<< HEAD
import styles from './map.module.css';
=======
>>>>>>> 188903e (카카오맵 API 구현 완료)

interface MapProps {
    width: string;
    height: string;
}

export default function Map({ width, height }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
<<<<<<< HEAD
        // 카카오맵 SDK가 로드되었는지 확인
        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                const options = {
                    center: new window.kakao.maps.LatLng(37.611035, 126.996573),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapRef.current, options);
=======
        if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                const options = {
                    center: new window.kakao.maps.LatLng(37.610600, 126.998927),
                    level: 3,
                };
                new window.kakao.maps.Map(mapRef.current, options);
>>>>>>> 188903e (카카오맵 API 구현 완료)
            });
        }
    }, []);

    return (
<<<<<<< HEAD
        <div
            ref={mapRef}
            className={styles.map}
            style={{ width, height }}
        ></div>
=======
        <div ref={mapRef} style={{ width, height, border: '1px solid #a7a7a7', borderRadius: '6px', margin: '10px auto' }}></div>
>>>>>>> 188903e (카카오맵 API 구현 완료)
    );
}