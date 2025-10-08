import iconStyles from '@/components/icon-button/icon-button.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import Map, { Car } from './map';

interface CarClustererMapProps {
  width: string;
  height: string;
  carStatusFilter: 'total' | 'driving' | 'maintenance' | 'idle';
  onOpenModal?: () => void;
  isMapModalOpen?: boolean;
}

export default function CarClustererMap({
  width,
  height,
  carStatusFilter,
  onOpenModal,
  isMapModalOpen,
}: CarClustererMapProps) {
  const mapRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);

  const handleMapLoad = useCallback((mapInstance: any) => {
    mapRef.current = mapInstance;
    // 지도 로딩 완료 후 relayout 실행
    setTimeout(() => {
      mapInstance.relayout();
    }, 100);
  }, []);

  const handleCarsUpdate = useCallback((updatedCars: Car[]) => {
    if (!clustererRef.current) {
      // 클러스터러 초기화
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map: mapRef.current,
        averageCenter: true,
        minLevel: 10,
        disableClickZoom: false,
      });

      // 클러스터 클릭 이벤트 리스너 추가
      window.kakao.maps.event.addListener(
        clustererRef.current,
        'clusterclick',
        function (cluster: any) {
          const center = cluster.getCenter();

          // 'idle' 이벤트에 대한 리스너를 한 번만 실행하도록 정의
          const centerAfterZoom = () => {
            mapRef.current.setCenter(center);
            // 이벤트 리스너를 사용 후 즉시 제거
            window.kakao.maps.event.removeListener(
              mapRef.current,
              'idle',
              centerAfterZoom
            );
          };

          // 'idle' 이벤트 리스너 등록
          window.kakao.maps.event.addListener(
            mapRef.current,
            'idle',
            centerAfterZoom
          );

          // 줌인 액션 실행
          mapRef.current.setLevel(mapRef.current.getLevel() - 1, {
            anchor: cluster.getCenter(),
            animate: { duration: 350 },
          });
        }
      );
    }

    // 기존 마커들 제거
    clustererRef.current.clear();

    // 필터링된 차량들에 대해 클러스터러 마커 생성
    const filteredCars = carStatusFilter === 'total' 
      ? updatedCars 
      : updatedCars.filter(car => car.status === carStatusFilter);

    const statusToImage = {
      driving: '/car_green.png',
      maintenance: '/car_red.png',
      idle: '/car_yellow.png',
    };

    const markers = filteredCars
      .filter(car => car.lastLatitude && car.lastLongitude)
      .map(car => {
        const markerImage = new window.kakao.maps.MarkerImage(
          statusToImage[car.status],
          new window.kakao.maps.Size(32, 32),
          { offset: new window.kakao.maps.Point(16, 32) }
        );

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            parseFloat(car.lastLatitude),
            parseFloat(car.lastLongitude)
          ),
          image: markerImage,
          title: car.carNumber,
        });

        // 마커 클릭 이벤트 추가
        window.kakao.maps.event.addListener(marker, 'click', function () {
          const position = marker.getPosition();
          // 'idle' 이벤트에 대한 리스너를 한 번만 실행하도록 정의
          const centerAfterZoom = () => {
            mapRef.current.setCenter(position);
            // 이벤트 리스너를 사용 후 즉시 제거하여 중복 실행 방지
            window.kakao.maps.event.removeListener(
              mapRef.current,
              'idle',
              centerAfterZoom
            );
          };

          // 'idle' 이벤트 리스너 등록
          window.kakao.maps.event.addListener(
            mapRef.current,
            'idle',
            centerAfterZoom
          );

          // 줌인 액션 실행
          mapRef.current.setLevel(3, { animate: { duration: 350 } });
        });

        return marker;
      });

    clustererRef.current.addMarkers(markers);
  }, [carStatusFilter]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <Map
        width={width}
        height={height}
        onLoad={handleMapLoad}
        enableAutoRefresh={true}
        onCarsUpdate={handleCarsUpdate}
        showMarkers={false}
        zoomLevel={13}
      />
      {onOpenModal && !isMapModalOpen && (
        <button
          className={iconStyles.fullScreen}
          onClick={onOpenModal}
        ></button>
      )}
    </div>
  );
}
