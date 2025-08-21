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
import { DoubleCalendar } from './double-calendar.tsx';

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
  const [status, setStatus] = useState('total');
  const [error, setError] = useState<string | null>(null);

  // 일주일 전을 기본 시작일로 설정
  const today = new Date();
  const weekAgo = new Date();
  console.log('weekAgo');
  console.log(weekAgo);
  weekAgo.setDate(today.getDate() - 7);
  console.log(weekAgo);
  weekAgo.setHours(0, 0, 0, 0);
  console.log(weekAgo);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    to: new Date(),
    from: weekAgo,
  });
  //  엑셀 다운로드 상태 추가
  const [isDownloading, setIsDownloading] = useState(false);

  // 일주일 전을 기본 시작일로 설정
  const today = new Date();
  const weekAgo = new Date();
  console.log('weekAgo');
  console.log(weekAgo);
  weekAgo.setDate(today.getDate() - 7);
  console.log(weekAgo);
  weekAgo.setHours(0, 0, 0, 0);
  console.log(weekAgo);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    to: new Date(),
    from: weekAgo,
  });

  // 초기 1회만 주행 기록 목록 로드
  // 초기 1회만 주행 기록 목록 로드
  useEffect(() => {
    loadInitialLogs();
  }, []);
    loadInitialLogs();
  }, []);

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

      // 브랜드/모델 처리
      if (brandModel.trim()) {
        const parts = brandModel.trim().split(/\s+/);
        const brand = parts[0] || '';
        const model = parts.slice(1).join(' ') || '';

        if (brand && model) {
          queryParams.brand = brand.trim();
          queryParams.model = model.trim();
          queryParams.twoParam = true;
        } else if (brand) {
          // 브랜드만 입력된 경우
          queryParams.brand = brand.trim();
          queryParams.twoParam = false;
        }
      }

      // 상태 처리 - total이면 status를 포함하지 않음
      if (status && status !== 'total') {
        queryParams.status = status;
      }

      // 브랜드/모델 처리
      if (brandModel.trim()) {
        const parts = brandModel.trim().split(/\s+/);
        const brand = parts[0] || '';
        const model = parts.slice(1).join(' ') || '';
      const result = await HistoryService.getDriveLogs(queryParams, 1, 10);
      console.log('통합 검색 결과:', result);
      onSearchResults(result.content, queryParams);
    } catch (error) {
      console.error('주행 기록 검색 실패:', error);
      alert('주행 기록 검색에 실패했습니다.');
      onSearchResults([]);
    } finally {
      onLoadingChange(false);
    }
  };

  // 엑셀 다운로드 함수 추가 (전체 함수 새로 추가)
  const handleExcelDownload = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      alert('주행 기간을 선택해주세요.');
      return;
    }

    try {
      setIsDownloading(true);

      // 현재 검색 조건과 동일한 파라미터 구성
      const queryParams: any = {
        startTime: dateRange.from.toISOString().split('T')[0], // YYYY-MM-DD 형식
        endTime: dateRange.to.toISOString().split('T')[0],
      };

      // 차량 번호가 입력된 경우만 추가
      if (carNumber.trim()) {
        queryParams.carNumber = carNumber.trim();
      }

      // 브랜드/모델 처리
      if (brandModel.trim()) {
        const parts = brandModel.trim().split(/\s+/);
        const brand = parts[0] || '';
        const model = parts.slice(1).join(' ') || '';

        if (brand && model) {
          queryParams.brand = brand.trim();
          queryParams.model = model.trim();
          queryParams.twoParam = true;
        } else if (brand) {
          // 브랜드만 입력된 경우
          queryParams.brand = brand.trim();
          queryParams.twoParam = false;
        }
        if (brand && model) {
          queryParams.brand = brand.trim();
          queryParams.model = model.trim();
          queryParams.twoParam = 'true';
        } else if (brand) {
          queryParams.brand = brand.trim();
          queryParams.twoParam = 'false';
        }
      }

      // 상태 처리 - total이면 status를 포함하지 않음
      if (status && status !== 'total') {
        queryParams.status = status;
      }

      const result = await HistoryService.getDriveLogs(queryParams, 1, 10);
      console.log('통합 검색 결과:', result);
      onSearchResults(result.content, queryParams);
      // URL 파라미터 생성
      const queryString = new URLSearchParams(queryParams).toString();
      const downloadUrl = `/api/drivelogs/excel?${queryString}`;

      // 새 창에서 다운로드
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('주행 기록 검색 실패:', error);
      alert('주행 기록 검색에 실패했습니다.');
      onSearchResults([]);
      console.error('엑셀 다운로드 실패:', error);
      alert('엑셀 다운로드에 실패했습니다.');
    } finally {
      setIsDownloading(false);
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
        <DoubleCalendar
          startTime={dateRange?.from}
          endTime={dateRange?.to}
          onStartTimeChange={date =>
            setDateRange(prev =>
              prev ? { ...prev, from: date } : { from: date, to: undefined }
            )
          }
          onEndTimeChange={date =>
            setDateRange(prev =>
              prev ? { ...prev, to: date } : { from: undefined, to: date }
            )
          }
        />
        <DoubleCalendar
          startTime={dateRange?.from}
          endTime={dateRange?.to}
          onStartTimeChange={date =>
            setDateRange(prev =>
              prev ? { ...prev, from: date } : { from: date, to: undefined }
            )
          }
          onEndTimeChange={date =>
            setDateRange(prev =>
              prev ? { ...prev, to: date } : { from: undefined, to: date }
            )
          }
        />
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
        />
        <Button
          onClick={handleExcelDownload} // onClick 핸들러 추가
          disabled={isDownloading} // disabled 속성 추가
          className="w-40 h-11 mt-3 ml-0 mr-3 bg-gradient-to-br from-green-600 to-green-700 text-white text-sm font-semibold border-0
            rounded-xl shadow-lg shadow-green-600/30 transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:shadow-green-800/40 active:scale-95 hover:-translate-y-1"
        >
          {/* 다운로드 상태에 따른 텍스트 변경 */}
          {isDownloading ? '다운로드 중...' : '엑셀 다운로드'}
        </Button>
      </div>
    </div>
  );
};

export default HistorySearchBox;
