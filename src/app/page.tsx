import Link from 'next/link';
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';
import MenuBox from '@/components/menuBox/menuBox';

export default function Home() {
  return (

    <div className="flex flex-col h-screen">
      <TopBar title="차량 관제 시스템"></TopBar>
      <div style={{ margin: '0px 115px' }}>

        <UserBox />
        <StatusContainer />
        <MenuBox></MenuBox>
      </div>
    </div>
  );
}
