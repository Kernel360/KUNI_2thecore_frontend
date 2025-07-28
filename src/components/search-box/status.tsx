import React from 'react';

interface StatusProps {
  status: '운행중' | '대기중' | '수리중';
}

const statusStyles: Record<string, { bg: string; color: string }> = {
  운행중: { bg: '#dbffc4', color: '#155764' }, // 연한 초록 배경, 진한 초록 글씨
  대기중: { bg: '#FFF3CD', color: '#706660' }, // 연한 노란 배경, 진한 노란 글씨
  수리중: { bg: '#F8D7DA', color: '#88313C' }, // 연한 빨간 배경, 진한 빨간 글씨
};

const Status: React.FC<StatusProps> = ({ status }) => {
  const style = statusStyles[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '8px 20px',
        borderRadius: '20px',
        background: style.bg,
        color: style.color,
        fontWeight: 700,
        fontSize: '1.3rem',
        textAlign: 'center',
        minWidth: '70px',
      }}
    >
      {status}
    </span>
  );
};

export default Status;
