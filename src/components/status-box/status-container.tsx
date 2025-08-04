import React from 'react';
import StatusBox from './status-box';

interface StatusContainerProps {
  carStatusFilter: 'null' | '운행중' | '수리중' | '대기중';
  setCarStatusFilter: (status: 'null' | '운행중' | '수리중' | '대기중') => void;
}

const StatusContainer = ({
  carStatusFilter,
  setCarStatusFilter,
}: StatusContainerProps) => {
  return (
    <div className="flex justify-center w-full gap-7 mt-5">
      <div
        onClick={() => setCarStatusFilter('null')}
        className="cursor-pointer"
      >
        <StatusBox
          num={100}
          text="전체 차량"
          active={carStatusFilter === 'null'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('운행중')}
        className="cursor-pointer"
      >
        <StatusBox
          num={57}
          text="운행 중"
          active={carStatusFilter === '운행중'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('대기중')}
        className="cursor-pointer"
      >
        <StatusBox
          num={13}
          text="대기 중"
          active={carStatusFilter === '대기중'}
        />
      </div>
      <div
        onClick={() => setCarStatusFilter('수리중')}
        className="cursor-pointer"
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
