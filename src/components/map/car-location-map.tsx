import { useCallback, useEffect, useRef, useState } from 'react';
import Map from './map';

export default function CarLocationMap({
  width,
  height,
  lastLatitude,
  lastLongitude,
  carNumber,
  status,
}: {
  width: string;
  height: string;
  lastLatitude?: string;
  lastLongitude?: string;
  carNumber: string;
  status: 'driving' | 'maintenance' | 'idle';
}) {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infowindowRef = useRef<any>(null);

  const loadCarLocation = useCallback(async () => {
    // props로 받은 위치 정보가 있는지 확인만 하면 됨
    return carNumber && lastLatitude && lastLongitude && status;
  }, [carNumber, lastLatitude, lastLongitude, status]);

  const handleMapLoad = useCallback((mapInstance: any) => {
    mapRef.current = mapInstance;
    setMapReady(true);
  }, []);

  // 차량 위치 마커 업데이트
  useEffect(() => {
    console.log('CarLocationMap useEffect triggered:', {
      mapReady,
      lastLatitude,
      lastLongitude,
      carNumber,
      status,
      hasMap: !!mapRef.current,
    });

    if (
      !mapRef.current ||
      !mapReady ||
      !lastLatitude ||
      !lastLongitude ||
      !carNumber ||
      !status
    ) {
      console.log(
        'CarLocationMap useEffect early return - missing required data'
      );
      return;
    }

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

    console.log('CarLocationMap creating marker at position:', {
      lat: parseFloat(lastLatitude),
      lng: parseFloat(lastLongitude),
      status,
      carNumber,
    });

    // 상태별 마커 이미지 설정 (car-clusterer-map과 동일한 방식)
    const statusToImage = {
      driving: '/car_green.png',
      maintenance: '/car_red.png',
      idle: '/car_yellow.png',
    };

    const markerImage = new window.kakao.maps.MarkerImage(
      statusToImage[status],
      new window.kakao.maps.Size(32, 32),
      { offset: new window.kakao.maps.Point(16, 32) }
    );

    console.log('CarLocationMap marker image created:', statusToImage[status]);

    // 새 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      title: carNumber,
    });

    console.log('CarLocationMap marker created, setting to map');
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
              <p style="margin: 0 0 5px 0; font-size: 12px;">${roadAddress}</p>
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
  }, [mapReady, lastLatitude, lastLongitude, carNumber, status]);

  return (
    <div style={{ width, height }}>
      <Map width={width} height={height} onLoad={handleMapLoad} />
    </div>
  );
}
