import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dropdown } from './dropdown';
import styles from './search-filter.module.css';

interface BrandFilterBoxProps {
  brandModel: string;
  setBrandModel: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  onFilterApply: () => void;
}

const BrandFilterBox = ({ brandModel, setBrandModel, status, setStatus, onFilterApply }: BrandFilterBoxProps) => {

  const handleFilterApply = () => {
    onFilterApply();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFilterApply();
    }
  };

  return (
    <div className={styles.filterContainer}>
      <Dropdown value={status} onValueChange={setStatus} />
      <Input
        type="text"
        placeholder="차량명 입력(브랜드 + 모델명)"
        className={styles.filterInput}
        value={brandModel}
        onChange={e => setBrandModel(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button className={styles.filterButton} onClick={handleFilterApply}>
        필터 적용
      </Button>
    </div>
  );
};

export default BrandFilterBox;
