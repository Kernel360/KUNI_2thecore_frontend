'use client';

import SearchBox from '@/components/search-box/search-box';
import TopBar from '@/components/ui/topBar';

export default function SearchPage() {
  return (
    <>
      <TopBar title="차량 검색"></TopBar>
      <div className="flex flex-row justify-center">
        <SearchBox />
      </div>
    </>
  );
}
