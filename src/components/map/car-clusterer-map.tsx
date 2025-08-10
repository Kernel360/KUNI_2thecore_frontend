import { useRef, useState } from 'react';

export interface Car {
  carNumber: string;
  status: '운행' | '대기' | '수리';
  gpsLatitude: string;
  gpsLongitude: string;
}

export interface WebSocketCarData {
  loginId: string;
  carNumber: string;
  logList: {
    latitude: string;
    longitude: string;
    timestamp: string;
  }[];
}

interface CarClustererMapProps {
  width: string;
  height: string;
  carStatusFilter: '운행' | '대기' | '수리' | 'null';
}

const statusToImage: { [key in Car['status']]?: string } = {
  운행: '/car_green.png',
  수리: '/car_red.png',
  대기: '/car_yellow.png',
};
export default function CarClustererMap({
  width,
  height,
  carStatusFilter,
}: CarClustererMapProps) {
  const [map, setMap] = useState<any>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const clustererRef = useRef<any>(null);

  //   const { connectionStatus, lastMessage, sendMessage } = useWebSocket({
  //     url: 'ws://localhost:8082/map/running',
  //     onOpen: () => {
  //       console.log('지도 WebSocket 연결됨');
  //     },
  //     onMessage: (message) => {
  //       if (message.type === 'message' && message.data) {
  //         try {
  //           const carData = message.data as WebSocketCarData;
  //           if (carData.logList && carData.logList.length > 0) {
  //             const latestLog = carData.logList[carData.logList.length - 1];
  //             const newCar: Car = {
  //               carNumber: carData.carNumber,
  //               status: '운행', // WebSocket으로 받은 차량은 운행 상태로 가정
  //               gpsLatitude: latestLog.latitude,
  //               gpsLongitude: latestLog.longitude
  //             };

  //             setCars(prevCars => {
  //               const existingIndex = prevCars.findIndex(car => car.carNumber === newCar.carNumber);
  //               if (existingIndex >= 0) {
  //                 const updated = [...prevCars];
  //                 updated[existingIndex] = newCar;
  //                 return updated;
  //               } else {
  //                 return [...prevCars, newCar];
  //               }
  //             });
  //           }
  //         } catch (error) {
  //           console.error('WebSocket 데이터 파싱 오류:', error);
  //         }
  //       }
  //     },
  //     onError: (error) => {
  //       console.error('지도 WebSocket 오류:', error);
  //     },
  //     onClose: () => {
  //       console.log('지도 WebSocket 연결 종료');
  //     },
  //     reconnectAttempts: 5,
  //     reconnectInterval: 3000
  //   });

  //   useEffect(() => {
  //     if (!map) return;

  //     clustererRef.current = new window.kakao.maps.MarkerClusterer({
  //       map: map,
  //       averageCenter: true,
  //       minLevel: 10,
  //       disableClickZoom: true,
  //     });

  //     // WebSocket 연결 상태 확인 후 초기 요청
  //     if (connectionStatus === 'Open') {
  //       sendMessage({
  //         type: 'request_running_cars',
  //         timestamp: new Date().toISOstring()
  //       });
  //     }
  //   }, [map, connectionStatus, sendMessage]);

  //   useEffect(() => {
  //     if (!clustererRef.current) return;

  //     clustererRef.current.clear();

  //     const filteredCars =
  //       carStatusFilter === '운행'
  //         ? cars
  //         : cars.filter(car => car.status === carStatusFilter);

  //     const markers = filteredCars
  //       .filter(car => statusToImage[car.status])
  //       .map(car => {
  //         const imageSrc = statusToImage[car.status]!;
  //         const imageSize = new window.kakao.maps.Size(32, 32);
  //         const imageOption = { offset: new window.kakao.maps.Point(16, 32) };
  //         const markerImage = new window.kakao.maps.MarkerImage(
  //           imageSrc,
  //           imageSize,
  //           imageOption
  //         );

  //         return new window.kakao.maps.Marker({
  //           position: new window.kakao.maps.LatLng(
  //             parseFloat(car.gpsLatitude),
  //             parseFloat(car.gpsLongitude)
  //           ),
  //           image: markerImage,
  //           title: car.carNumber,
  //         });
  //       });

  //     clustererRef.current.addMarkers(markers);
  //   }, [cars, carStatusFilter]);

  //   return (
  //     <div className="relative">
  //       {connectionStatus !== 'Open' && (
  //         <div className="absolute top-2 right-2 z-10 px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
  //           WebSocket {connectionStatus === 'Connecting' ? '연결 중...' : '연결 끊김'}
  //         </div>
  //       )}
  //       <Map width={width} height={height} onLoad={setMap} />
  //     </div>
  //   );
}
