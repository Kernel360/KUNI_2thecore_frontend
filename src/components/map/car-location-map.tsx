import { CarDetail, CarService } from '@/services/car-service';
import { useDetailStore } from '@/store/detail-store';
import { useEffect, useRef, useState } from 'react';
import Map from './map';

export default function CarLocationMap({
  width,
  height,
}: {
  width: string;
  height: string;
}) {
  const [carLocation, setCarLocation] = useState<CarDetail | null>(null);
  const [address, setAddress] = useState<string>('');
  const [map, setMap] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infowindowRef = useRef<any>(null);

  const { carNumber } = useDetailStore();

  const loadCarLocation = async () => {
    if (!carNumber) return;

    try {
      const carDetail = await CarService.getCarLocation(carNumber);
      setCarLocation(carDetail);
    } catch (error) {
      console.error('차량 위치 데이터 조회 실패:', error);
    }
  };

  useEffect(() => {
    if (carNumber) {
      loadCarLocation();
    }
  }, [carNumber]);

  const handleMapLoad = (mapInstance: any) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  };

  useEffect(() => {
    if (
      !mapRef.current ||
      !carLocation ||
      !carLocation.lastLatitude ||
      !carLocation.lastLongitude
    )
      return;

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

    const marker = new window.kakao.maps.Marker({
      position: position,
    });
    marker.setMap(mapRef.current);
    markerRef.current = marker;

    const infowindow = new window.kakao.maps.InfoWindow({
      zIndex: 1,
    });
    infowindowRef.current = infowindow;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(
      position.getLng(),
      position.getLat(),
      (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const roadAddress = result[0].road_address?.address_name || '';
          setAddress(roadAddress);

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
      />
    </div>
  );
}
