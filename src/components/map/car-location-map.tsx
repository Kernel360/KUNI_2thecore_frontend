import { useSingleCarStompWebSocket } from '@/services/websocket-service';
import { CarLocationData } from '@/types/websocket';
import { useCallback, useEffect, useRef, useState } from 'react';
import Map from './map';

export default function CarLocationMap({
  width,
  height,
  lastLatitude,
  lastLongitude,
  carNumber,
  status,
  useWebSocket = false,
}: {
  width: string;
  height: string;
  lastLatitude?: string;
  lastLongitude?: string;
  carNumber: string;
  status: 'driving' | 'maintenance' | 'idle';
  useWebSocket?: boolean;
}) {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infowindowRef = useRef<any>(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: lastLatitude,
    longitude: lastLongitude,
    status,
  });

  // STOMP WebSocket 실시간 위치 업데이트 (운행 중인 차량만)
  const handleLocationUpdate = useCallback(
    (carData: CarLocationData) => {
      setCurrentLocation({
        latitude: carData.lastLatitude,
        longitude: carData.lastLongitude,
        status:
          carData.status === '운행'
            ? 'driving'
            : carData.status === '대기'
              ? 'idle'
              : 'maintenance',
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`📍 차량 ${carNumber} 실시간 위치 업데이트:`, carData);
      }
    },
    [carNumber]
  );

  const { isConnected: wsConnected } = useSingleCarStompWebSocket(
    carNumber,
    handleLocationUpdate,
    useWebSocket && status === 'driving' // 운행 중인 차량만 WebSocket 구독
  );

  const loadCarLocation = useCallback(async () => {
    // props로 받은 위치 정보가 있는지 확인만 하면 됨
    return carNumber && lastLatitude && lastLongitude && status;
  }, [carNumber, lastLatitude, lastLongitude, status]);

  const handleMapLoad = useCallback((mapInstance: any) => {
    mapRef.current = mapInstance;
    setMapReady(true);
  }, []);

  // props 변경 시 현재 위치 업데이트
  useEffect(() => {
    setCurrentLocation({
      latitude: lastLatitude,
      longitude: lastLongitude,
      status,
    });
  }, [lastLatitude, lastLongitude, status]);

  // 차량 위치 마커 업데이트 (실시간 위치 또는 props 사용)
  useEffect(() => {
    const { latitude, longitude, status: currentStatus } = currentLocation;

    if (process.env.NODE_ENV === 'development') {
      console.log('CarLocationMap useEffect triggered:', {
        mapReady,
        latitude,
        longitude,
        carNumber,
        status: currentStatus,
        hasMap: !!mapRef.current,
        useWebSocket,
        wsConnected,
      });
    }

    if (
      !mapRef.current ||
      !mapReady ||
      !latitude ||
      !longitude ||
      !carNumber ||
      !currentStatus
    ) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'CarLocationMap useEffect early return - missing required data'
        );
      }
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
      parseFloat(latitude),
      parseFloat(longitude)
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('CarLocationMap creating marker at position:', {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        status: currentStatus,
        carNumber,
      });
    }

    // 상태별 마커 이미지 설정 (car-clusterer-map과 동일한 방식)
    const statusToImage = {
      driving: '/car_green.png',
      maintenance: '/car_red.png',
      idle: '/car_yellow.png',
    };

    const markerImage = new window.kakao.maps.MarkerImage(
      statusToImage[currentStatus],
      new window.kakao.maps.Size(32, 32),
      { offset: new window.kakao.maps.Point(16, 32) }
    );

    if (process.env.NODE_ENV === 'development') {
      console.log(
        'CarLocationMap marker image created:',
        statusToImage[currentStatus]
      );
    }

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
  }, [mapReady, currentLocation, carNumber]);

  return (
    <div style={{ width, height }}>
      <Map width={width} height={height} onLoad={handleMapLoad} />
    </div>
  );
}
