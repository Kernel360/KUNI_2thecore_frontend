import MenuBox from '@/components/menu-box/menu-box';
import TopBar from '@/components/ui/topBar';
import { Outlet, useLocation } from 'react-router-dom';
import styles from '@/components/menu-box/menu-box.module.css';

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen">
      <div className={styles.headerBorder}>
        <TopBar showLogo={true} />
        <MenuBox />
      </div>
      <div className="mx-auto flex flex-col justify-center items-center w-full flex-1 mt-2">
        <div
          className={`bg-[#f6f6f6] pt-0 px-2.5 pb-6 mt-[3px] w-[98%] h-fit max-w-[1260px] min-h-[500px] rounded-[10px] mb-6
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
