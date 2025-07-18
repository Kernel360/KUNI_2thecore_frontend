import Link from 'next/link';
import TopBar from './components/ui/topBar';
import UserBox from './components/userBox';

export default function Home() {
  return (
    <div>
      <TopBar title="차량 관제 시스템"></TopBar>
      <UserBox />
    </div>
  );
}
