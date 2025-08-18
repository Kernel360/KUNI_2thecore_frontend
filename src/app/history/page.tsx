import HistorySearchBox from '@/components/history-search-box/history-search-box';
<<<<<<< Updated upstream

export default function History() {
  return (
    <div className="gap-6 p-4 h-full w-[98%] mx-auto">
      <HistorySearchBox />
=======
import TopBar from '@/components/ui/topBar';
import {
  DriveLog,
  DriveLogQueryParams,
  HistoryService,
} from '@/services/history-service';
import { useState } from 'react';

export default function History() {
  const [historyData, setHistoryData] = useState<DriveLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<DriveLogQueryParams>({});

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
    } catch (error) {
      console.error('정렬 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="주행 기록"></TopBar>
      <div className="gap-6 p-4 h-full w-[98%] mx-auto">
        <HistorySearchBox
          onSearchResults={(data, params) => {
            setHistoryData(data);
            if (params) setSearchParams(params);
          }}
          onLoadingChange={setLoading}
        />
        <HistoryListBox
          historyData={historyData}
          loading={loading}
          onSort={handleSort}
        />
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
