import MenuBox from '@/components/menu-box/menu-box';
import SearchBox from '@/components/search-box/search-box';
import TopBar from '@/components/ui/topBar';

export default function SearchPage() {
  return (
    <>
      <TopBar title="차량 검색"></TopBar>
      <MenuBox />
      <div className="flex flex-row justify-center">
        <SearchBox />
      </div>
    </>
  );
}
