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
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infowindowRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number | null>(null);

  // props 초기값 표시
  const [currentLocation, setCurrentLocation] = useState({
    latitude: lastLatitude,
    longitude: lastLongitude,
    status,
  });

  // STOMP WebSocket 실시간 위치 업데이트 (운행 중인 차량만, 줌레벨 8이하만)
  const handleLocationUpdate = useCallback(
    (carData: CarLocationData) => {
      const newStatus =
        carData.status === '운행'
          ? 'driving'
          : carData.status === '대기'
            ? 'idle'
            : 'maintenance';

      setCurrentLocation({
        latitude: carData.lastLatitude,
        longitude: carData.lastLongitude,
        status: newStatus,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`📍 차량 ${carNumber} 실시간 위치 업데이트:`, carData);
      }
    },
    [carNumber]
  );

  const enabled =
    useWebSocket &&
    currentZoom !== null &&
    currentZoom <= 8 &&
    status === 'driving';

  const { isConnected: wsConnected } = useSingleCarStompWebSocket(
    carNumber,
    handleLocationUpdate,
    enabled
  );

  const handleMapLoad = useCallback((mapInstance: any) => {
    mapRef.current = mapInstance;
    setMapReady(true);
    try {
      setCurrentZoom(mapInstance.getLevel());
      // 줌 변화 감지
      window.kakao.maps.event.addListener(mapInstance, 'zoom_changed', () => {
        setCurrentZoom(mapInstance.getLevel());
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // props 변경 시 현재 위치 업데이트 (initial)
  useEffect(() => {
    setCurrentLocation({
      latitude: lastLatitude,
      longitude: lastLongitude,
      status,
    });
  }, [lastLatitude, lastLongitude, status]);

  // 마커, 인포위도우 업데이트
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
        currentZoom,
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

    const statusToImage = {
      driving: '/car_green.png',
      maintenance: '/car_red.png',
      idle: '/car_yellow.png',
    } as const;

    const markerImage = new window.kakao.maps.MarkerImage(
      statusToImage[currentStatus as keyof typeof statusToImage],
      new window.kakao.maps.Size(32, 32),
      { offset: new window.kakao.maps.Point(16, 32) }
    );

    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      title: carNumber,
    });

    marker.setMap(mapRef.current);
    markerRef.current = marker;

    const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    infowindowRef.current = infowindow;

    // 주소 조회 및 인포윈도우 표시
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(
      position.getLng(),
      position.getLat(),
      (result: any, statusCode: any) => {
        if (statusCode === window.kakao.maps.services.Status.OK) {
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

    // 차량 위치가 변경될 때 지도의 중심을 따라가도록 설정
    mapRef.current.setLevel(3);
    mapRef.current.setCenter(position);
  }, [mapReady, currentLocation, carNumber, wsConnected, currentZoom]);

  return (
    <div style={{ width, height }}>
      <Map width={width} height={height} onLoad={handleMapLoad} />
    </div>
  );
}
