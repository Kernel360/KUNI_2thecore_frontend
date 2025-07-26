import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import styles from './search-filter.module.css';

const NumberSearchBox = () => {
  return (
    <div className={styles.numberSearchContainer}>
      <Input
        type="text"
        placeholder="차량 번호"
        className={styles.numberSearchInput}
      />
      <Button className={styles.searchButton}>검색</Button>
    </div>
  );
};

export default NumberSearchBox;
