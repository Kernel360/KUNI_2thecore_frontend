import { StatisticsService } from '@/services/statistics-service';
import { useEffect, useState } from 'react';
import StatusBox from './status-box';
import styles from './status-box.module.css';
import StatusText from './status-text';

interface StatusContainerProps {
  carStatusFilter: 'total' | 'driving' | 'maintenance' | 'idle';
  setCarStatusFilter: (
    status: 'total' | 'driving' | 'maintenance' | 'idle'
  ) => void;
}

const StatusContainer = ({
  carStatusFilter,
  setCarStatusFilter,
}: StatusContainerProps) => {
  const [carSummary, setCarSummary] = useState({
    total: 0,
    driving: 0,
    idle: 0,
    maintenance: 0,
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
          driving: 0,
          idle: 0,
          maintenance: 0,
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
      <div
        onClick={() => setCarStatusFilter('total')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary['total']}
          text="전체 차량"
          active={carStatusFilter === 'total'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('driving')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary['driving']}
          text="운행 중"
          active={carStatusFilter === 'driving'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('idle')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary['idle']}
          text="대기 중"
          active={carStatusFilter === 'idle'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('maintenance')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary['maintenance']}
          text="수리 중"
          active={carStatusFilter === 'maintenance'}
        />
      </div>
    </div>
  );
};

export default StatusContainer;
