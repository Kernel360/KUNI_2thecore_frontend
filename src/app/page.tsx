import Link from 'next/link';
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';

export default function Home() {
  return (

    <div className="flex flex-col h-screen">
      <TopBar title="차량 관제 시스템"></TopBar>
      <UserBox />
      <StatusContainer />
      <div style={{
        display: 'flex', justifyContent: 'center', width: '100%', gap: '35px', marginTop: '20px'
      }}>
      </div>
    </div>
  );
}
