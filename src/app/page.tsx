import Link from 'next/link';
import TopBar from './components/ui/topBar';

export default function Home() {
  return (
    <div>
      <TopBar title="차량 관제 시스템"></TopBar>
      <div className="box-border size-10 border-10 bg-blue-100 p-4">
      </div>
    </div>
  );
}
