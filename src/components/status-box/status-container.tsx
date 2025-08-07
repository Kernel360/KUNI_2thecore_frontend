import { useEffect, useState } from 'react';
import { CarService } from '@/services/car-service';
import { CarSummary } from '@/lib/api';
import { StatisticsService, CarStatistics } from '@/services/statistics-service';
import StatusBox from './status-box';
import styles from './status-box.module.css';
import StatusText from './status-text';

interface StatusContainerProps {
  carStatusFilter: '운행중' | '수리중' | '대기중';
  setCarStatusFilter: (status: '운행중' | '수리중' | '대기중') => void;
}

const StatusContainer = ({
  carStatusFilter,
  setCarStatusFilter,
}: StatusContainerProps) => {
  const [carSummary, setCarSummary] = useState<CarStatistics>({
    total: 0,
    operating: 0,
    waiting: 0,
    inspecting: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarStatistics = async () => {
      try {
        setError(null);
        const statistics = await StatisticsService.getCarStatistics();
        setCarSummary(statistics);
      } catch (error) {
        console.error('차량 통계 조회 실패:', error);
        setError('차량 통계를 불러오는데 실패했습니다.');
        // 에러 발생 시 기본값 설정
        setCarSummary({
          total: 0,
          operating: 0,
          waiting: 0,
          inspecting: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCarStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-between w-full gap-6 mt-6 px-4 flex-wrap">
        <div className={styles.totalCar}>
          <StatusText num={0} text="로딩 중..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between w-full gap-6 mt-6 px-4 flex-wrap">
      {error && (
        <div className="w-full mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className={styles.totalCar}>
        <StatusText num={carSummary.total} text="전체 차량" />
      </div>
      <div
        onClick={() => setCarStatusFilter('운행중')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary.operating}
          text="운행 중"
          active={carStatusFilter === '운행중'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('대기중')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary.waiting}
          text="대기 중"
          active={carStatusFilter === '대기중'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('수리중')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary.inspecting}
          text="수리 중"
          active={carStatusFilter === '수리중'}
        />
      </div>
    </div>
  );
};

export default StatusContainer;
