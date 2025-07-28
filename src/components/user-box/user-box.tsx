import React from 'react';
import { Button } from '@/components/ui/button';
import styles from './user-box.module.css';

const UserBox = () => {
  return (
    <div className={styles.div}>
      <h5>관리자님</h5>
      <div className="flex justify-center">
        <Button className={styles.Button}>로그아웃</Button>
      </div>
    </div>
  );
};
export default UserBox;
