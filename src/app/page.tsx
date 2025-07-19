import Link from 'next/link';
<<<<<<< HEAD
import TopBar from './components/ui/topBar';
import UserBox from './components/userBox';
import StatusBox from './components/statusBox/statusBox';
import Map from './components/map';
import styles from './components/map.module.css';
=======
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';
import MenuBox from '@/components/menuBox/menuBox';
>>>>>>> HomePage

export default function Home() {
  return (

    <div className="flex flex-col h-screen">
      <TopBar title="차량 관제 시스템"></TopBar>
<<<<<<< HEAD
      <UserBox />
<<<<<<< HEAD
    </div >
=======
      <div style={{
        display: 'flex', justifyContent: 'center', width: '100%', gap: '35px', marginTop: '20px'
      }}>
        <StatusBox num={100} text="전체 차량" />
        <StatusBox num={57} text="운행 중" />
        <StatusBox num={13} text="대기 중" />
        <StatusBox num={50} text="수리 중" />
      </div>
      <div className={styles.mapContainer}>
        <Map width="500px" height="400px" />
      </div>
    </div >
>>>>>>> 012f24f (카카오맵 API로 지도 구현)
=======
      <div style={{ margin: '0px 115px' }}>
        <div style={{backgroundColor: '#f6f6f6' ,zIndex: 100, padding:'0px 15px 100px 15px', marginTop:'3px'}}>
        <UserBox />
        <StatusContainer />
        <MenuBox></MenuBox>
      </div>
      </div>
    </div>
>>>>>>> HomePage
  );
}
