'use client';
import { useEffect, useRef } from 'react';
import styles from './map.module.css';

interface MapProps {
    width: string;
    height: string;
}

export default function Map({ width, height }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 카카오맵 SDK가 로드되었는지 확인
        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                const options = {
                    center: new window.kakao.maps.LatLng(37.611035, 126.996573),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapRef.current, options);
            });
        }
    }, []);

    return (
        <div
            ref={mapRef}
            className={styles.map}
            style={{ width, height }}
        ></div>
    );
}