import { useCallback, useEffect, useRef, useState } from 'react';
import Map from './map';

export default function CarLocationMap({
  width,
  height,
  lastLatitude,
  lastLongitude,
  carNumber,
}: {
  width: string;
  height: string;
  lastLatitude?: string;
  lastLongitude?: string;
  carNumber: string;
}) {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infowindowRef = useRef<any>(null);

  const loadCarLocation = useCallback(async () => {
    // props로 받은 위치 정보가 있는지 확인만 하면 됨
    return carNumber && lastLatitude && lastLongitude;
  }, [carNumber, lastLatitude, lastLongitude]);

  const handleMapLoad = useCallback((mapInstance: any) => {
    mapRef.current = mapInstance;
    setMapReady(true);
  }, []);

  // 차량 위치 마커 업데이트
  useEffect(() => {
    if (
      !mapRef.current ||
      !mapReady ||
      !lastLatitude ||
      !lastLongitude ||
      !carNumber
    )
      return;

    // 기존 마커와 인포윈도우 제거
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    if (infowindowRef.current) {
      infowindowRef.current.close();
    }

    const position = new window.kakao.maps.LatLng(
      parseFloat(lastLatitude),
      parseFloat(lastLongitude)
    );

    // 새 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: position,
    });
    marker.setMap(mapRef.current);
    markerRef.current = marker;

    // 인포윈도우 생성
    const infowindow = new window.kakao.maps.InfoWindow({
      zIndex: 1,
    });
    infowindowRef.current = infowindow;

    // 주소 조회 및 인포윈도우 표시
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(
      position.getLng(),
      position.getLat(),
      (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const roadAddress = result[0].road_address?.address_name || '';

          const content = `
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 5px 0;">${carNumber}</h4>
              <p style="margin: 0; font-size: 12px;">${roadAddress}</p>
            </div>
          `;

          infowindow.setContent(content);
          infowindow.open(mapRef.current, marker);
        }
      }
    );

    // 지도 중심을 차량 위치로 이동하고 확대
    mapRef.current.setLevel(3);
    mapRef.current.setCenter(position);
  }, [mapReady, lastLatitude, lastLongitude, carNumber]);

  return (
    <div style={{ width, height }}>
      <Map
        width={width}
        height={height}
        onLoad={handleMapLoad}
        onRefresh={loadCarLocation}
        enableAutoRefresh={true}
      />
    </div>
  );
}
