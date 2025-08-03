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
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          maxWidth: '1200px',
          margin: 'auto',
        }}
      >
        <NumberSearchBox />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="flex"
              style={{
                backgroundColor: 'white',
                width: '200px',
                height: '44px',
                border: '2px solid #d3d3d3',
                borderRadius: '6px',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                color: '#666',
                fontSize: '14px',
              }}
            >
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
          maxWidth: '1200px',
          margin: '20px auto 0 auto',
        }}
      >
        <BrandFilterBox />
        <Button
          className="flex"
          style={{
            width: '200px',
            height: '44px',
            backgroundColor: '#099add',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '6px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          엑셀 다운로드
        </Button>
      </div>
    </div>
  );
};

export default HistorySearchBox;
