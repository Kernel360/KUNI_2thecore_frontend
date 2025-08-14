import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import styles from './search-filter.module.css';

interface NumberSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const NumberSearchBox = ({ value, onChange, onSearch }: NumberSearchBoxProps) => {

  const handleSearch = () => {
    onSearch();
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
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button className={styles.searchButton} onClick={handleSearch}>
        검색
      </Button>
    </div>
  );
};

export default NumberSearchBox;
