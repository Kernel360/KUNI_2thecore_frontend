'use client';

import HistorySearchBox from '@/components/search-box/history-search-box';
import HistoryListBox from '@/components/search-box/list-box/history-list-box';
import TopBar from '@/components/ui/topBar';

export default function History() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar title="주행 기록"></TopBar>
      <div className="gap-6 p-4 h-full w-[98%] mx-auto">
        <HistorySearchBox />
        <HistoryListBox />
      </div>
    </div>
  );
}
