import { useEffect, useRef, useState } from "react";
import StatusMarker from "./StatusMarker";

const ZOOM_THRESHOLD = 5;

export interface Car {
    car_id: number;
    status: '운행중' | '대기중' | '수리중';
    gps_latitude: number;
    gps_longitude: number;
}

const statusToImage = {
    '운행중': '/car_green.png',
    '수리중': '/car_red.png',
    '대기중': '/car_yellow.png',
};

export default function MapWithCars({ width, height }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined" && window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                const options = {
                    center: new window.kakao.maps.LatLng(37.6106, 126.998927),
                    level: 3,
                };
                const mapInstance = new window.kakao.maps.Map(mapRef.current, options);
                setMap(mapInstance);
            });
        }
    }, []);

    useEffect(() => {
        if (!map) return;

        const handleZoomChanged = () => {
            const level = map.getLevel();
            if (level <= ZOOM_THRESHOLD) {
                // 지도 bounds 얻기
                const bounds = map.getBounds();
                const sw = bounds.getSouthWest();
                const ne = bounds.getNorthEast();
                // API 호출
                fetch(`/api/cars?swLat=${sw.getLat()}&swLng=${sw.getLng()}&neLat=${ne.getLat()}&neLng=${ne.getLng()}`)
                    .then(res => res.json())
                    .then(data => setCars(data));
            } else {
                setCars([]); // 마커 제거
            }
        };

        window.kakao.maps.event.addListener(map, "zoom_changed", handleZoomChanged);

        // 최초 진입 시에도 한 번 실행
        handleZoomChanged();

        return () => {
            window.kakao.maps.event.removeListener(map, "zoom_changed", handleZoomChanged);
        };
    }, [map]);

    return (
        <div ref={mapRef} style={{ width, height, border: "1px solid #a7a7a7", borderRadius: "6px", margin: "10px auto" }}>
            {map && <StatusMarker cars={cars} map={map} />}
        </div>
    );
}
