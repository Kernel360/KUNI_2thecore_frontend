

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import BrandFilterBox from './filter-box';
import { RangeCalendar } from './range-calendar';
import styles from './search-filter.module.css';

const HistorySearchBox = () => {
  const [carNumber, setCarNumber] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleSearch = () => {
    if (!carNumber.trim()) {
      alert('차량 번호를 입력해주세요.');
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      alert('날짜 범위를 선택해주세요.');
      return;
    }

    // 검색 로직 실행
    console.log('검색 실행:', { carNumber, dateRange });
  };

  return (
    <div className="flex flex-col">
      <div className={styles.numberSearchContainer}>
        <Input
          type="text"
          placeholder="차량 번호"
          className={styles.numberSearchInput}
          value={carNumber}
          onChange={e => setCarNumber(e.target.value)}
          required
        />
        <RangeCalendar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <Button className={styles.searchButton} onClick={handleSearch}>
          검색
        </Button>
      </div>
      <div className="flex flex-row p-3">
        <BrandFilterBox />
        <Button
          className="w-40 h-11 mt-3 ml-0 mr-3 bg-gradient-to-br from-green-600 to-green-700 text-white text-sm font-semibold border-0
          rounded-xl shadow-lg shadow-sky-600/30 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:shadow-green-800/40 active:scale-95 hover:-translate-y-1"
        >
          엑셀 다운로드
        </Button>
      </div>
    </div>
  );
};

export default HistorySearchBox;
