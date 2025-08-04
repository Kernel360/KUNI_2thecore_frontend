'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
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
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex bg-white w-[200px] h-11 border-2 border-[#d3d3d3] rounded-md items-center justify-between px-4 text-[#666] text-sm">
              <span>조회 기간</span>
              <Image
                src="/calendar_month_24dp_434343.svg"
                alt="calendar"
                width={20}
                height={20}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <RangeCalendar />
          </PopoverContent>
        </Popover>
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
