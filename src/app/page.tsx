import Link from 'next/link';
import TopBar from '../components/ui/topBar';
import UserBox from '../components/userBox/userBox';
import StatusBox from '../components/statusBox/statusBox';
import Map from '../components/map';
import styles from '../components/map.module.css';

export default function Home() {
  return (
<<<<<<< HEAD
    <div>
=======

    <div className="flex flex-col h-screen">
      
>>>>>>> 3552754 (feat: carSearch input, 검색 버튼)
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
