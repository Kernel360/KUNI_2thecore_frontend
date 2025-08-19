import MenuBox from '@/components/menu-box/menu-box';
import TopBar from '@/components/ui/topBar';
import { Outlet, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isFloatingPage =
    location.pathname === '/history' || location.pathname === '/search';

  return (
    <div className="flex flex-col h-screen">
      <TopBar showLogo={true} />
      <MenuBox />
      <div className="mx-auto flex flex-col justify-center items-center w-full flex-1 mt-2">
        <div
          className={`bg-[#f6f6f6] pt-0 px-2.5 pb-6 mt-[3px] w-full h-fit max-w-[1290px] rounded-[10px] ${
            isFloatingPage ? 'mb-6' : ''
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
