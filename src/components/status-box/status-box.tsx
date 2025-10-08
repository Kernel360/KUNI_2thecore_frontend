import { Button } from '@/components/ui/button';
import React from 'react';
import styles from './status-box.module.css';
import StatusText from './status-text';

interface StatusBoxProps {
  num: number;
  text: string;
  active?: boolean;
}

const StatusBox: React.FC<StatusBoxProps> = ({ num, text, active }) => {
  return (
    <Button className={`${styles.Button} ${active ? styles.active : ''}`}>
      <StatusText num={num} text={text} />
    </Button>
  );
};

export default StatusBox;
