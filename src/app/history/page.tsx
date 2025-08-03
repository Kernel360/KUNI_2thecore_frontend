'use client';

import HistorySearchBox from '@/components/search-box/history-search-box';
import HistoryListBox from '@/components/search-box/list-box/history-list-box';
import TopBar from '@/components/ui/topBar';

export default function History() {
  return (
    <div>
      <TopBar title="주행 기록"></TopBar>
      <HistorySearchBox />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        <HistoryListBox />
      </div>
    </div>
  );
}
