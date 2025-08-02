'use client';

import HistorySearchBox from '@/components/search-box/history-search-box';
import HistoryListBox from '@/components/search-box/list-box/history-list-box';
import TopBar from '@/components/ui/topBar';

export default function History() {
  return (
    <div>
      <TopBar title="주행 기록"></TopBar>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '4px',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        <HistorySearchBox />
        <HistoryListBox />
      </div>
    </div>
  );
}
