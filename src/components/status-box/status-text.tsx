import React from 'react';
import styles from './status-text.module.css';

interface StatusTextProps {
  num: number;
  text: string;
}

const StatusText: React.FC<StatusTextProps> = ({ num, text }) => {
  return (
    <div className={styles.div}>
      <h1 style={{ color: '#0070f3' }}>{num}</h1>
      <h4
        style={{
          fontWeight: '500',
          fontSize: '14px',
          paddingBottom: '15px',
          color: '#000000',
          margin: 0,
        }}
      >
        {text}
      </h4>
    </div>
  );
};

export default StatusText;
