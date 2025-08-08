import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CarService } from '@/services/car-service';
import { Car } from '@/lib/api';
import styles from './search-filter.module.css';

interface NumberSearchBoxProps {
  onSearchResults: (cars: Car[]) => void;
}

const NumberSearchBox: React.FC<NumberSearchBoxProps> = ({ onSearchResults }) => {
  const [carNumber, setCarNumber] = useState('');

  const handleSearch = async () => {
    try {
      if (carNumber.trim()) {
        // 차량번호로 검색
        const results = await CarService.searchCars(
          { carNumber: carNumber.trim() },
          1,
          50
        );
        onSearchResults(results.content);
      } else {
        // 전체 차량 조회
        const allCars = await CarService.getAllCars(1, 50);
        onSearchResults(allCars.content);
      }
    } catch (error) {
      console.error('차량 번호 검색 실패:', error);
      alert('차량 번호 검색에 실패했습니다.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.numberSearchContainer}>
      <Input
        type="text"
        placeholder="차량 번호"
        className={styles.numberSearchInput}
        value={carNumber}
        onChange={(e) => setCarNumber(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button className={styles.searchButton} onClick={handleSearch}>검색</Button>
    </div>
  );
};

export default NumberSearchBox;
