'use client';

import TopBar from '@/components/ui/topBar';
import HistorySearchBox from '@/components/search-box/history-search-box';
import HistoryListBox from '@/components/search-box/list-box/history-list-box';

export default function History() {
  return (
    <div>
      <TopBar title="주행 기록"></TopBar>
      <HistorySearchBox />
      <HistoryListBox />
    </div>
  );
}