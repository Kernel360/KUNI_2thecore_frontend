import {
  DriveLog,
  DriveLogQueryParams,
  HistoryService,
} from '@/services/history-service';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import BrandFilterBox from '../search-box/filter-box';
import styles from '../search-box/search-filter.module.css';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { RangeCalendar } from './range-calendar';

interface HistorySearchBoxProps {
  onSearchResults: (data: DriveLog[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

const HistorySearchBox = ({
  onSearchResults,
  onLoadingChange,
}: HistorySearchBoxProps) => {
  const [carNumber, setCarNumber] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleSearch = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      alert('주행 기간을 선택해주세요.');
      return;
    }

    onLoadingChange(true);
    try {
      const queryParams: DriveLogQueryParams = {
        status: '운행',
        startTime: dateRange.from,
        endTime: dateRange.to,
      };

      // 차량 번호가 입력된 경우만 추가
      if (carNumber.trim()) {
        queryParams.carNumber = carNumber.trim();
      }

      const driveLogs = await HistoryService.getDriveLogs(queryParams);
      onSearchResults(driveLogs);

      console.log('검색 결과:', driveLogs);
    } finally {
      onLoadingChange(false);
    }
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
        />
        <RangeCalendar dateRange={dateRange} onDateRangeChange={setDateRange} />
        <Button
          className={styles.searchButton}
          onClick={handleSearch}
          disabled={false}
        >
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
