import TopBar from '@/components/ui/topBar';
import CarSearchBox from '@/components/carSearchBox/carNumberSearchBox';

export default function Search() {
  return (
    <div>

      <TopBar title="차량 검색"></TopBar>
      <CarSearchBox />

    </div>
  );
}
