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
  return (
    <div className="flex justify-between w-full gap-6 mt-6 px-4 flex-wrap">
      <div className={styles.totalCar}>
        <StatusText num={100} text="전체 차량" />
      </div>
      <div
        onClick={() => setCarStatusFilter('운행중')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={57}
          text="운행 중"
          active={carStatusFilter === '운행중'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('대기중')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={13}
          text="대기 중"
          active={carStatusFilter === '대기중'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('수리중')}
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
      >
        <StatusBox
          num={50}
          text="수리 중"
          active={carStatusFilter === '수리중'}
        />
      </div>
    </div>
  );
};

export default StatusContainer;
