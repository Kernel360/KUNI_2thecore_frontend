import React from 'react';

interface StatusProps {
  status: '운행' | '대기' | '수리';
}

const statusStyles: Record<string, { bg: string; color: string }> = {
  운행: { bg: '#dbffc4', color: '#155764' }, // 연한 초록 배경, 진한 초록 글씨
  대기: { bg: '#FFF3CD', color: '#706660' }, // 연한 노란 배경, 진한 노란 글씨
  수리: { bg: '#F8D7DA', color: '#88313C' }, // 연한 빨간 배경, 진한 빨간 글씨
};

const Status: React.FC<StatusProps> = ({ status }) => {
  const style = statusStyles[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '7px 15px',
        borderRadius: '20px',
        background: style.bg,
        color: style.color,
        fontWeight: 700,
        fontSize: '1rem',
        textAlign: 'center',
        minWidth: '70px',
      }}
    >
      {status}
    </span>
  );
};

export default Status;
