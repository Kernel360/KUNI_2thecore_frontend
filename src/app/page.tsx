import CarClustererMap from '@/components/map/car-clusterer-map';
import KakaoMapScript from '@/components/map/kakao-map-script';
import MapModal from '@/components/map/map-modal';
import MenuBox from '@/components/menu-box/menu-box';
import StatusContainer from '@/components/status-box/status-container';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import TopBar from '@/components/ui/topBar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const [carStatusFilter, setCarStatusFilter] = useState<
    'total' | 'driving' | 'maintenance' | 'idle'
  >('total');

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  localStorage.setItem('loginId', 'dev');
  localStorage.setItem(
    'accessToken',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZXYiLCJsb2dpbklkIjoiZGV2IiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTc1NTMyODg1MSwiZXhwIjoxNzU1MzI5NDUxfQ.ehnzwZvMmDzjNL399ZAI6PnbCqsnOV0nKa_CKc9a3w8'
  );

  return (
    <>
      <div className="flex flex-col h-screen">
        <TopBar title="차량 관제 시스템"></TopBar>
        <div className="bg-blue-600 shadow-md">
          <NavigationMenu className="max-w-full justify-start px-4 py-2">
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white data-[state=open]:bg-blue-700`}
                >
                  <Link to="/">🏠 홈</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white data-[state=open]:bg-blue-700`}
                >
                  <Link to="/search">🚗 차량 검색</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white data-[state=open]:bg-blue-700`}
                >
                  <Link to="/history">📊 주행 기록</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white data-[state=open]:bg-blue-700`}
                >
                  <Link to="/emulator">⚒️ 에뮬레이터</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white data-[state=open]:bg-blue-700`}
                >
                  <Link to="/detail">🔧 에뮬레이터</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex flex-col gap-6 p-4 h-full w-[98%] mx-auto">
          <div>
            <StatusContainer
              carStatusFilter={carStatusFilter}
              setCarStatusFilter={setCarStatusFilter}
            />
          </div>
          <div className="flex flex-row gap-4 flex-1 px-4">
            <div className="flex-shrink-0">
              <MenuBox onOpenMapModal={() => setIsMapModalOpen(true)} />
            </div>
            <div className="relative flex-1 max-h-[800px] mb-9 rounded-2xl overflow-hidden border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
              <KakaoMapScript />
              <CarClustererMap
                width="100%"
                height="100%"
                carStatusFilter={carStatusFilter}
              />
            </div>
          </div>
        </div>
        <MapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
        />
      </div>
    </>
  );
}

