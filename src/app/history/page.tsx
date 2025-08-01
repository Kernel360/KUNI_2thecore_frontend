import React from 'react';

'use client';

import TopBar from '@/components/ui/topBar';
import SearchBox from '@/components/search-box/search-box';

export default function History() {
  return (
    <div>
      <TopBar title="주행 기록"></TopBar>
      <SearchBox />
    </div>
  );
}
