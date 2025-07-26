import React from 'react';
import { Dropdown } from './dropdown';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import styles from './search-filter.module.css';

const BrandFilterBox = () => {
  return (
    <div className={styles.filterContainer}>
      <Dropdown />
      <Input
        type="text"
        placeholder="차량명 입력(브랜드 + 모델명)"
        className={styles.filterInput}
      />
      <Button className={styles.filterButton}>필터 적용</Button>
    </div>
  );
};

export default BrandFilterBox;
