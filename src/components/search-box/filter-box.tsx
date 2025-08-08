import React, { useState } from 'react';
import { Dropdown } from './dropdown';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CarService } from '@/services/car-service';
import { Car } from '@/lib/api';
import styles from './search-filter.module.css';

interface BrandFilterBoxProps {
  onFilterResults: (cars: Car[]) => void;
  onStatusChange: (status: '운행' | '대기' | '점검' | null) => void;
}

const BrandFilterBox: React.FC<BrandFilterBoxProps> = ({ onFilterResults, onStatusChange }) => {
  const [brandModel, setBrandModel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'운행' | '대기' | '점검' | null>(null);

  const handleStatusChange = (value: string) => {
    const status = value === 'null' ? null : (value as '운행' | '대기' | '점검');
    setSelectedStatus(status);
    onStatusChange(status);
  };

  const handleFilter = async () => {
    try {
      if (brandModel.trim() || selectedStatus) {
        // 브랜드/모델명으로 검색
        const results = await CarService.searchCars(
          { brand: brandModel.trim() || undefined },
          1,
          50
        );
        
        // 상태별 필터링 (클라이언트 사이드)
        let filteredResults = results.content;
        if (selectedStatus) {
          filteredResults = results.content.filter(car => car.status === selectedStatus);
        }
        
        onFilterResults(filteredResults);
      } else {
        // 전체 차량 조회
        const allCars = await CarService.getAllCars(1, 50);
        onFilterResults(allCars.content);
      }
    } catch (error) {
      console.error('차량 필터링 실패:', error);
      alert('차량 검색에 실패했습니다.');
    }
  };

  return (
    <div className={styles.filterContainer}>
      <Dropdown onValueChange={handleStatusChange} />
      <Input
        type="text"
        placeholder="차량명 입력(브랜드 + 모델명)"
        className={styles.filterInput}
        value={brandModel}
        onChange={(e) => setBrandModel(e.target.value)}
      />
      <Button className={styles.filterButton} onClick={handleFilter}>필터 적용</Button>
    </div>
  );
};

export default BrandFilterBox;
