import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import styles from './search-filter.module.css';

const NumberSearchBox = () => {
  const [carNumber, setCarNumber] = useState('');

  const handleSearch = () => {
    if (!carNumber.trim()) {
      alert('차량 번호를 입력해주세요.');
      return;
    }

    console.log('검색 실행:', { carNumber });
  };

  return (
    <div className={styles.numberSearchContainer}>
      <Input
        type="text"
        placeholder="차량 번호"
        className={styles.numberSearchInput}
        value={carNumber}
        onChange={e => setCarNumber(e.target.value)}
        required
      />
      <Button className={styles.searchButton}>검색</Button>
    </div>
  );
};

export default NumberSearchBox;
