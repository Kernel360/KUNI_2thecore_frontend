import React from 'react';
import { Input } from '../ui/input';
import { Dropdown } from './dropdown';
import styles from './search-filter.module.css';

interface BrandFilterBoxProps {
  brandModel: string;
  setBrandModel: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

const BrandFilterBox = ({
  brandModel,
  setBrandModel,
  status,
  setStatus,
}: BrandFilterBoxProps) => {
  return (
    <div className={styles.filterContainer}>
      <Dropdown value={status} onValueChange={setStatus} />
      <Input
        type="text"
        placeholder="차량명 입력(브랜드 + 모델명)"
        className={styles.filterInput}
        value={brandModel}
        onChange={e => setBrandModel(e.target.value)}
      />
    </div>
  );
};

export default BrandFilterBox;
