import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dropdown } from './dropdown';
import styles from './search-filter.module.css';

interface BrandFilterBoxProps {
  onFilterApply: (brand: string, model: string, status: string) => void;
}

const BrandFilterBox = ({ onFilterApply }: BrandFilterBoxProps) => {
  const [brandModel, setBrandModel] = useState('');
  const [status, setStatus] = useState('');

  const handleFilterApply = () => {
    // 브랜드와 모델을 분리 (공백으로 구분)
    const parts = brandModel.trim().split(/\s+/);
    const brand = parts[0] || '';
    const model = parts.slice(1).join(' ') || '';

    // 최소한 하나의 조건은 있어야 함
    if (!brand && !model && !status) {
      return;
    }

    onFilterApply(brand, model, status);
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
