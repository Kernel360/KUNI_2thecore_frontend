'use client';

import { Button } from '../ui/button';
import BrandFilterBox from './filter-box';
import NumberSearchBox from './number-search-box';
import { RangeCalendar } from './range-calendar';
import styles from './search-filter.module.css';

const HistorySearchBox = () => {
  return (
    <div className="p-5">
      <div className="flex flex-row justify-between items-center gap-4 w-full max-w-[1200px] mx-auto">
        <NumberSearchBox />
        <RangeCalendar />
        <Button className={styles.searchButton}>검색</Button>
      </div>
      <div className="flex flex-row justify-between items-center gap-4 w-full max-w-[1200px] mx-auto mt-5">
        <BrandFilterBox />
        <Button
          className="w-50 h-11 bg-gradient-to-br from-green-500 to-sky-500 text-white text-sm font-semibold border-0
          rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 ease-in-out cursor-pointer flex items-center
          justify-center hover:shadow-xl hover:shadow-blue-600/40 active:scale-95"
        >
          엑셀 다운로드
        </Button>
      </div>
    </div>
  );
};

export default HistorySearchBox;
