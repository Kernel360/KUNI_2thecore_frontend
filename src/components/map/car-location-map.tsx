import { CarService } from '@/services/car-service';
import { useDetailStore } from '@/store/detail-store';
import { useEffect, useRef, useState } from 'react';
import Map from './map';

export interface Car {
  lastLatitude: string;
  lastLongitude: string;
}

export default function CarLocationMap({
  width,
  height,
}: {
  width: string;
  height: string;
}) {
  const [carLocation, setCarLocation] = useState<Car | null>(null);
  const [address, setAddress] = useState<string>('');
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infowindowRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { carNumber } = useDetailStore();

  const loadCarLocation = async () => {
    if (!carNumber) return;

    try {
      const locations = await CarService.getCarLocations();
      const selectedCar = locations.find(loc => loc.carNumber === carNumber);

      if (selectedCar) {
        setCarLocation({
          lastLatitude: selectedCar.lastLatitude,
          lastLongitude: selectedCar.lastLongitude,
        });
      }
    } catch (error) {
      console.error('차량 위치 데이터 조회 실패:', error);
    }
  };

  useEffect(() => {
    if (carNumber) {
      loadCarLocation();

      intervalRef.current = setInterval(() => {
        loadCarLocation();
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [carNumber]);
  const handleMapLoad = (mapInstance: any) => {
    mapRef.current = mapInstance;
  };

  useEffect(() => {
    if (!mapRef.current || !carLocation) return;

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
        width="100%"
        height="100%"
        onLoad={handleMapLoad}
        onOpenMapModal={close}
      />
    </div>
  );
}
