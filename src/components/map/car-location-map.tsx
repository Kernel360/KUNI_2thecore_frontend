import { useEffect, useRef, useState } from 'react';
import Map from './map';

export interface Car {
  last_latitude: string;
  last_longitude: string;
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

  useEffect(() => {
    setCarLocation({
      last_latitude: '37.566826',
      last_longitude: '126.9786567',
    });
  }, []);

  const handleMapLoad = (mapInstance: any) => {
    mapRef.current = mapInstance;

    if (carLocation) {
      const position = new window.kakao.maps.LatLng(
        parseFloat(carLocation.last_latitude),
        parseFloat(carLocation.last_longitude)
      );

      const marker = new window.kakao.maps.Marker({
        position: position,
      });
      marker.setMap(mapInstance);

      const infowindow = new window.kakao.maps.InfoWindow({
        zIndex: 1,
      });

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.coord2Address(
        position.getLng(),
        position.getLat(),
        (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            //변환 성공 시에만 처리
            const roadAddress = result[0].road_address?.address_name || '';
            setAddress(roadAddress);

            const content = `
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 5px 0;">현재 위치</h4>
              <p style="margin: 0; font-size: 12px;">${roadAddress}</p>
            </div>
          `;

            infowindow.setContent(content);
            infowindow.open(mapInstance, marker);
          }
        }
      );

      mapInstance.setLevel(3);
      mapInstance.setCenter(position);
    }
  };

  return (
    <div style={{ width, height }}>
      <Map width="100%" height="100%" onLoad={handleMapLoad} />
    </div>
  );
}
