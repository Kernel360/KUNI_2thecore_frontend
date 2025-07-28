'use client';

import TopBar from '@/components/ui/topBar';
import SearchBox from '@/components/search-box/search-box';

export default function SearchPage() {
  return (
    <div>
      <TopBar title="차량 검색"></TopBar>
      <SearchBox />
    </div>
  );
}
