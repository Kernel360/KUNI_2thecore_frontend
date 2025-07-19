import Link from 'next/link';
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';
import MenuBox from '@/components/menuBox/menuBox';
import Map from '@/components/map';
import KakaoMapScript from '@/components/KakaoMapScript';

export default function Home() {
  return (

    <div className="flex flex-col h-screen">
      <TopBar title="차량 관제 시스템"></TopBar>
      <StatusContainer />
      <MenuBox></MenuBox>

      <div style={{ margin: '0px 115px' }}>
        <div style={{ backgroundColor: '#f6f6f6', zIndex: 100, padding: '0px 15px 100px 15px', marginTop: '3px' }}>
        </div>
      </div>
    </div >
  );
}
