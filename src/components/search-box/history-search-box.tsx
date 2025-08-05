'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import BrandFilterBox from './filter-box';
import { RangeCalendar } from './range-calendar';
import styles from './search-filter.module.css';

const HistorySearchBox = () => {
  return (
    <div className="flex flex-col">
      <div className={styles.numberSearchContainer}>
        <Input
          type="text"
          placeholder="차량 번호"
          className={styles.numberSearchInput}
        />
        <RangeCalendar />
        <Button className={styles.searchButton}>검색</Button>
      </div>
      <div className="flex flex-row p-3">
        <BrandFilterBox />
        <Button
          className="w-40 h-11 mt-3 ml-0 mr-3 bg-gradient-to-br from-green-500 to-sky-500 text-white text-sm font-semibold border-0
          rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-xl hover:shadow-green-600/40 active:scale-95"
        >
          엑셀 다운로드
        </Button>
      </div>
    </div>
  );
};

export default HistorySearchBox;
