import React from 'react';
import styles from './status-text.module.css';

interface StatusTextProps {
  num: number;
  text: string;
}

const StatusText: React.FC<StatusTextProps> = ({ num, text }) => {
  return (
    <div className={styles.div}>
      <h1 className="text-[#0070f3]">{num}</h1>
      <h4 className="font-medium text-lg pb-[15px] text-black m-0">{text}</h4>
    </div>
  );
};

export default StatusText;
