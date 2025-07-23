import TopBar from '@/components/ui/topBar';
import CarSearchBox from '@/components/carSearchBox/carSearchBox';

export default function SearchPage() {
  return (
    <div>
      <TopBar title="차량 검색"></TopBar>
      <CarSearchBox />
    </div>
  );
}
