import useObserver from '@/hooks/use-intersection-observer';
import {
  DriveLog,
  DriveLogQueryParams,
  HistoryService,
} from '@/services/history-service';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import BrandFilterBox from '../search-box/filter-box';
import styles from '../search-box/search-filter.module.css';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { RangeCalendar } from './range-calendar';

interface HistorySearchBoxProps {
  onSearchResults: (data: DriveLog[], params?: DriveLogQueryParams) => void;
  onLoadingChange: (loading: boolean) => void;
}

const HistorySearchBox = ({
  onSearchResults,
  onLoadingChange,
}: HistorySearchBoxProps) => {
  const [carNumber, setCarNumber] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [status, setStatus] = useState('운행');
  const [logs, setLogs] = useState<DriveLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // 무한 스크롤
  const { page, setPage, isFetching, setIsFetching, setLastIntersecting } =
    useObserver();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentSearchParams, setCurrentSearchParams] =
    useState<DriveLogQueryParams | null>(null);

  // 초기 주행 기록 목록 로드 (dateRange가 설정된 후)
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      loadInitialLogs();
    }
  }, [dateRange]);

  // 페이지 변경 시 추가 데이터 로드 (무한 스크롤)
  useEffect(() => {
    if (page === 1 || !hasNextPage) return;

    const loadMoreCars = async () => {
      try {
        setIsFetching(true);

        let result;
        if (currentSearchParams) {
          result = await HistoryService.getDriveLogs(
            currentSearchParams,
            page,
            10
          );
        } else {
          result = await HistoryService.getDriveLogs({}, page, 10);
        }

        if (result.content.length > 0) {
          setLogs(prevLogs => [...prevLogs, ...result.content]);
          setHasNextPage(result.content.length === 10);
        } else {
          setHasNextPage(false);
        }
      } catch (error) {
        console.error('추가 데이터 로드 실패:', error);
      } finally {
        setIsFetching(false);
      }
    };

    loadMoreCars();
  }, [page, currentSearchParams, hasNextPage]);

  const loadInitialLogs = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    try {
      onLoadingChange(true);
      setError(null);
      const queryParams: DriveLogQueryParams = {
        startTime: dateRange.from,
        endTime: dateRange.to,
        page: 1,
        offset: 10,
      };

      const result = await HistoryService.getDriveLogs(queryParams, 1, 10);
      setLogs(result.content);
      setPage(1);
      setHasNextPage(result.content.length === 10);
      setCurrentSearchParams(queryParams);
      console.log('loadInitialLogs result:', result);
      onSearchResults(result.content, queryParams);
    } catch (error) {
      console.error('주행 기록 조회 실패:', error);
      setError('주행 기록을 불러오는데 실패했습니다.');
    } finally {
      onLoadingChange(false);
    }
  };

  const handleSearch = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      alert('주행 기간을 선택해주세요.');
      return;
    }

    try {
      onLoadingChange(true);
      setError(null);

      const queryParams: DriveLogQueryParams = {
        startTime: dateRange.from,
        endTime: dateRange.to,
        page: 1,
        offset: 10,
      };

      // 차량 번호가 입력된 경우만 추가
      if (carNumber.trim()) {
        queryParams.carNumber = carNumber.trim();
      }

      const result = await HistoryService.getDriveLogs(queryParams, 1, 10);
      console.log('검색 결과:', result);
      setLogs(result.content);
      setPage(1);
      setHasNextPage(result.content.length === 10);
      setCurrentSearchParams(queryParams);
      onSearchResults(result.content, queryParams);
    } catch (error) {
      console.error('주행 기록 검색 실패:', error);
      alert('주행 기록 검색에 실패했습니다.');
      onSearchResults([]);
    } finally {
      onLoadingChange(false);
    }
  };

  // 필터 적용 (브랜드/모델 + 상태)
  const handleFilterApply = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      alert('주행 기간을 선택해주세요.');
      return;
    }

    try {
      onLoadingChange(true);
      const parts = brandModel.trim().split(/\s+/);
      const brand = parts[0] || '';
      const model = parts.slice(1).join(' ') || '';

      const queryParams: DriveLogQueryParams = {
        startTime: dateRange.from,
        endTime: dateRange.to,
        page: 1,
        offset: 10,
      };

      // 브랜드와 모델 처리
      if (brand && model) {
        queryParams.brand = brand.trim();
        queryParams.model = model.trim();
        queryParams.twoParam = true;
      } else if (brand) {
        // 브랜드만 입력된 경우
        queryParams.brand = brand.trim();
        queryParams.twoParam = false;
      } else if (model) {
        // 모델만 입력된 경우
        queryParams.brand = model.trim();
        queryParams.twoParam = false;
      }

      // 상태 처리
      if (status) {
        queryParams.status = status;
      }

      const result = await HistoryService.getDriveLogs(queryParams, 1, 10);
      setLogs(result.content);
      setPage(1);
      setHasNextPage(result.content.length === 10);
      setCurrentSearchParams(queryParams);
      onSearchResults(result.content, queryParams);
    } catch (error) {
      console.error('필터 검색 실패:', error);
      alert('필터 검색에 실패했습니다.');
      onSearchResults([]);
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
        <BrandFilterBox
          brandModel={brandModel}
          setBrandModel={setBrandModel}
          status={status}
          setStatus={setStatus}
          onFilterApply={handleFilterApply}
        />
        <Button
          className="w-40 h-11 mt-3 ml-0 mr-3 bg-gradient-to-br from-green-600 to-green-700 text-white text-sm font-semibold border-0
          rounded-xl shadow-lg shadow-green-600/30 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:shadow-green-800/40 active:scale-95 hover:-translate-y-1"
        >
          엑셀 다운로드
        </Button>
      </div>
    </div>
  );
};

export default HistorySearchBox;
