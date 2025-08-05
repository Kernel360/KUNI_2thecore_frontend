'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import BrandFilterBox from './filter-box';
import NumberSearchBox from './number-search-box';
import { RangeCalendarFrom, RangeCalendarTo } from './range-calendar';
import styles from './search-filter.module.css';

const HistorySearchBox = () => {
  return (
    <div className="p-5">
      <div className="flex flex-row justify-between items-center gap-4 w-full max-w-[1200px] mx-auto">
        <NumberSearchBox />
        <RangeCalendarFrom />
        <RangeCalendarTo />
        <Button className={styles.searchButton}>검색</Button>
      </div>
      <div className="flex flex-row justify-between items-center gap-4 w-full max-w-[1200px] mx-auto mt-5">
        <BrandFilterBox />
        <Button className="flex w-[200px] h-11 bg-[#099add] text-white text-sm font-medium rounded-md items-center justify-center">
          엑셀 다운로드
        </Button>
      </div>
    </div>
  );
};

export default HistorySearchBox;
