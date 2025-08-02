'use client';

import { Button } from '../ui/button';
import BrandFilterBox from './filter-box';
import NumberSearchBox from './number-search-box';
import { RangeCalendar } from './range-calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import styles from './search-filter.module.css';

const HistorySearchBox = () => {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '4px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        <NumberSearchBox />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">조회 기간</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            {' '}
            <RangeCalendar />
          </PopoverContent>
        </Popover>
        <Button className={styles.searchButton}>검색</Button>
        <BrandFilterBox />
        <Button className={styles.searchButton}>엑셀 다운</Button>
      </div>
    </>
  );
};

export default HistorySearchBox;
