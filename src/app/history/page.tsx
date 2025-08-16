import HistoryListBox from '@/components/history-search-box/history-list-box/history-list-box';
import HistorySearchBox from '@/components/history-search-box/history-search-box';
import TopBar from '@/components/ui/topBar';
import { DriveLog } from '@/services/history-service';
import { useState } from 'react';

export default function History() {
  const [historyData, setHistoryData] = useState<DriveLog[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSort = (sortBy: string, order: 'asc' | 'desc') => {
    console.log({ sortBy, order });
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="주행 기록"></TopBar>
      <div className="gap-6 p-4 h-full w-[98%] mx-auto">
        <HistorySearchBox
          onSearchResults={setHistoryData}
          onLoadingChange={setLoading}
        />
        <HistoryListBox
          historyData={historyData}
          loading={loading}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}
