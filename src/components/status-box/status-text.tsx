import React from 'react';
import styles from './status-text.module.css';

interface StatusTextProps {
  num: number;
  text: string;
}

const StatusText: React.FC<StatusTextProps> = ({ num, text }) => {
  return (
    <div className={styles.div}>
      <h1 className="text-[#3a70ff]">{num}</h1>
      <h4 className="font-medium text-sm text-black m-0">{text}</h4>
    </div>
  );
};

export default StatusText;
