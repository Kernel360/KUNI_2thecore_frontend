import HistoryListBox from '@/components/history-search-box/history-list-box/history-list-box';
import HistorySearchBox from '@/components/history-search-box/history-search-box';
import useObserver from '@/hooks/use-intersection-observer';
import {
  DriveLog,
  DriveLogQueryParams,
  HistoryService,
} from '@/services/history-service';
import { useEffect, useState } from 'react';

export default function History() {
  const [historyData, setHistoryData] = useState<DriveLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<DriveLogQueryParams>({});

  // 무한 스크롤 hook을 page level로 이동
  const { page, setPage, isFetching, setIsFetching, setLastIntersecting } =
    useObserver();
  const [hasNextPage, setHasNextPage] = useState(true);

  // 페이지 변경 시 추가 데이터 로드 (무한 스크롤)
  useEffect(() => {
    if (
      page === 1 ||
      !hasNextPage ||
      !searchParams ||
      Object.keys(searchParams).length === 0
    )
      return;

    const loadMoreLogs = async () => {
      try {
        setIsFetching(true);

        const result = await HistoryService.getDriveLogs(
          searchParams,
          page,
          10
        );

        if (result.content.length > 0) {
          setHistoryData(prevLogs => [...prevLogs, ...result.content]);
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

    loadMoreLogs();
  }, [page, searchParams, hasNextPage]);

  const handleSort = async (sortBy: string, order: 'ASC' | 'DESC') => {
    setLoading(true);
    try {
      const updatedParams: DriveLogQueryParams = {
        ...searchParams,
        sortBy,
        sortOrder: order,
      };
      setSearchParams(updatedParams);

      const response = await HistoryService.getDriveLogs(updatedParams);
      setHistoryData(response.content);
      setPage(1); // 정렬 시 페이지 리셋
      setHasNextPage(response.content.length === 10);
    } catch (error) {
      console.error('정렬 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (
    data: DriveLog[],
    params?: DriveLogQueryParams
  ) => {
    setHistoryData(data);
    if (params) {
      setSearchParams(params);
      setPage(1);
      setHasNextPage(data.length === 10);
    }
  };

  return (
    <div className="gap-6 p-4 h-full w-[98%] mx-auto">
      <HistorySearchBox
        onSearchResults={handleSearchResults}
        onLoadingChange={setLoading}
      />
      <HistoryListBox
        historyData={historyData}
        loading={loading}
        onSort={handleSort}
        setLastIntersecting={setLastIntersecting}
      />
    </div>
  );
}
