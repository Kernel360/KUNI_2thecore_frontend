import { CarDetail } from '@/services/car-service';
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
  const [carLocation, setCarLocation] = useState<CarDetail | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infowindowRef = useRef<any>(null);

  const loadCarLocation = useCallback(async () => {
    if (!carNumber || !lastLatitude || !lastLongitude) return;

    // props의 위치 정보를 CarDetail 형식으로 변환
    const carDetail: CarDetail = {
      carNumber,
      brand: '',
      model: '',
      brandModel: '',
      status: '운행',
      lastLatitude,
      lastLongitude,
    };
    setCarLocation(carDetail);
  }, [carNumber, lastLatitude, lastLongitude]);

  const handleMapLoad = useCallback((mapInstance: any) => {
    mapRef.current = mapInstance;
    setMapReady(true);
  }, []);

  // props 변경 시 차량 위치 업데이트
  useEffect(() => {
    if (mapReady && lastLatitude && lastLongitude && carNumber) {
      loadCarLocation();
    }
  }, [mapReady, lastLatitude, lastLongitude, carNumber, loadCarLocation]);

  // 차량 위치 마커 업데이트 및 인포윈도우 표시
  useEffect(() => {
    if (
      !mapRef.current ||
      !carLocation ||
      !carLocation.lastLatitude ||
      !carLocation.lastLongitude
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
      parseFloat(carLocation.lastLatitude),
      parseFloat(carLocation.lastLongitude)
    );

    // status에 따른 마커 이미지 결정
    const statusToImage = {
      '운행': '/car_green.png',
      '수리': '/car_red.png',
      '대기': '/car_yellow.png',
    };

    const markerImageSrc = statusToImage[carLocation.status as keyof typeof statusToImage] || '/car_yellow.png';
    
    // 커스텀 마커 이미지 생성
    const markerImage = new window.kakao.maps.MarkerImage(
      markerImageSrc,
      new window.kakao.maps.Size(32, 32),
      { offset: new window.kakao.maps.Point(16, 32) }
    );

    // 새 마커 생성
    const marker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      title: carNumber,
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
    geocoder.coord2Address(position.getLng(), position.getLat(), (result: any, status: any) => {
      const roadAddress = status === window.kakao.maps.services.Status.OK 
        ? result[0].road_address?.address_name || result[0].address?.address_name || '주소를 찾을 수 없습니다'
        : '주소 조회 실패';

      infowindow.setContent(`
        <div style="padding: 8px; min-width: 200px;">
          <h4 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${carNumber}</h4>
          <p style="margin: 0; font-size: 12px; color: #666;">${roadAddress}</p>
        </div>
      `);
      infowindow.open(mapRef.current, marker);
    });

    // 지도 중심을 차량 위치로 이동하고 확대
    mapRef.current.setLevel(3);
    mapRef.current.setCenter(position);
  }, [carLocation, carNumber]);

  return (
    <div style={{ width, height }}>
      <Map
        width={width}
        height={height}
        onLoad={handleMapLoad}
        onRefresh={loadCarLocation}
        enableAutoRefresh={true}
        zoomLevel={3}
      />
    </div>
  );
}
