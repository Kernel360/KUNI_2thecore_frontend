import { useEffect, useRef, useState } from 'react';

interface GPXCoordinate {
  latitude: number;
  longtitude: number;
}

interface UseGPXReaderOptions {
  gpxFiles: string[];
  intervalMs?: number;
  batchSize?: number;
  onBatchReady?: (
    batch: { carNumber: string; coordinates: GPXCoordinate[] }[]
  ) => void;
}

export const useGPXReader = ({
  gpxFiles,
  intervalMs = 1000,
  batchSize = 60,
  onBatchReady,
}: UseGPXReaderOptions) => {
  const [isReading, setIsReading] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<{
    [key: string]: GPXCoordinate[];
  }>({});
  const [coordinatesData, setCoordinatesData] = useState<{
    [key: string]: GPXCoordinate[];
  }>({});
  const [currentIndices, setCurrentIndices] = useState<{
    [key: string]: number;
  }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // GPX 파일 파싱 함수
  const parseGPXFile = async (gpxUrl: string): Promise<GPXCoordinate[]> => {
    try {
      const response = await fetch(gpxUrl);
      const gpxText = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(gpxText, 'application/xml');
      const trackPoints = xmlDoc.getElementsByTagName('trkpt');

      const coordinates: GPXCoordinate[] = [];
      for (let i = 0; i < trackPoints.length; i++) {
        const latitude = parseFloat(
          trackPoints[i].getAttribute('latitude') || '0'
        );
        const longtitude = parseFloat(
          trackPoints[i].getAttribute('longtitude') || '0'
        );
        coordinates.push({ latitude, longtitude: longtitude });
      }

      return coordinates;
    } catch (error) {
      console.error(`GPX 파일 파싱 오류: ${gpxUrl}`, error);
      return [];
    }
  };

  // GPX 파일들 로드
  useEffect(() => {
    const loadGPXFiles = async () => {
      const data: { [key: string]: GPXCoordinate[] } = {};
      const indices: { [key: string]: number } = {};

      for (const gpxFile of gpxFiles) {
        const fileName = gpxFile.replace('.gpx', '');
        const carNumber = `${Math.floor(Math.random() * 89) + 10}가${Math.floor(Math.random() * 9000) + 1000}`;
        const coordinates = await parseGPXFile(`/gpx/${gpxFile}`);

        data[carNumber] = coordinates;
        indices[carNumber] = 0;
      }

      setCoordinatesData(data);
      setCurrentIndices(indices);
    };

    if (gpxFiles.length > 0) {
      loadGPXFiles();
    }
  }, [gpxFiles]);

  // GPX 데이터 읽기 시작
  const startReading = () => {
    if (isReading || Object.keys(coordinatesData).length === 0) return;

    setIsReading(true);
    setCurrentBatch({});

    intervalRef.current = setInterval(() => {
      setCurrentIndices(prevIndices => {
        const newIndices = { ...prevIndices };
        const newBatch = { ...currentBatch };

        Object.keys(coordinatesData).forEach(carNumber => {
          const coordinates = coordinatesData[carNumber];
          const currentIndex = newIndices[carNumber];

          if (currentIndex < coordinates.length) {
            if (!newBatch[carNumber]) {
              newBatch[carNumber] = [];
            }

            newBatch[carNumber].push(coordinates[currentIndex]);
            newIndices[carNumber] = currentIndex + 1;
          }
        });

        setCurrentBatch(newBatch);

        // 배치 크기 체크 및 전송
        const shouldSendBatch = Object.values(newBatch).some(
          coords => coords.length >= batchSize
        );
        if (shouldSendBatch && onBatchReady) {
          const batchToSend = Object.entries(newBatch)
            .filter(([_, coords]) => coords.length >= batchSize)
            .map(([carNumber, coordinates]) => ({
              carNumber,
              coordinates: coordinates.slice(0, batchSize),
            }));

          onBatchReady(batchToSend);

          // 전송된 좌표들 제거
          Object.keys(newBatch).forEach(carNumber => {
            if (newBatch[carNumber].length >= batchSize) {
              newBatch[carNumber] = newBatch[carNumber].slice(batchSize);
            }
          });
          setCurrentBatch(newBatch);
        }

        return newIndices;
      });
    }, intervalMs);
  };

  // GPX 데이터 읽기 중지
  const stopReading = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsReading(false);
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isReading,
    startReading,
    stopReading,
    currentBatch,
    loadedCars: Object.keys(coordinatesData),
  };
};
