import { useEffect, useState } from 'react';
import { CarService } from '@/services/car-service';
import { CarSummary } from '@/lib/api';
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
  const [carSummary, setCarSummary] = useState<CarSummary>({
    totalCount: 0,
    operatingCount: 0,
    waitingCount: 0,
    repairCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarStatistics = async () => {
      try {
        const statistics = await CarService.getCarStatistics();
        setCarSummary(statistics);
      } catch (error) {
        console.error('차량 통계 조회 실패:', error);
        // 에러 발생 시 기본값 유지
        setCarSummary({
          totalCount: 100,
          operatingCount: 57,
          waitingCount: 13,
          repairCount: 50,
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
      <div className={styles.totalCar}>
        <StatusText num={carSummary.totalCount} text="전체 차량" />
      </div>
      <div
        onClick={() => setCarStatusFilter('운행중')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary.operatingCount}
          text="운행 중"
          active={carStatusFilter === '운행중'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('대기중')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary.waitingCount}
          text="대기 중"
          active={carStatusFilter === '대기중'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('수리중')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={carSummary.repairCount}
          text="수리 중"
          active={carStatusFilter === '수리중'}
        />
      </div>
    </div>
  );
};

export default StatusContainer;
