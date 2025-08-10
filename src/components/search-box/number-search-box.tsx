import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import styles from './search-filter.module.css';

interface NumberSearchBoxProps {
  onSearch: (carNumber: string) => void;
}

const NumberSearchBox = ({ onSearch }: NumberSearchBoxProps) => {
  const [carNumber, setCarNumber] = useState('');

  const handleSearch = () => {
    const trimmedCarNumber = carNumber.trim();
    if (trimmedCarNumber) {
      onSearch(trimmedCarNumber);
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
        onChange={e => setCarNumber(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button className={styles.searchButton} onClick={handleSearch}>
        검색
      </Button>
    </div>
  );
};

export default NumberSearchBox;
