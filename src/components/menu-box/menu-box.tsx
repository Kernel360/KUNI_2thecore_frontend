import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';

interface MenuBoxProps {
  onOpenMapModal: () => void;
}

const MenuBox = ({ onOpenMapModal }: MenuBoxProps) => {
  return (
    <div className="shadow-md" style={{ background: 'var(--main-gradient)' }}>
      <NavigationMenu className="max-w-full justify-start px-4 py-2">
        <NavigationMenuList className="gap-6">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:text-white focus:text-white`}
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Link to="/">🏠 홈</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:text-white focus:text-white`}
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Link to="/search">🚗 차량 검색</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:text-white focus:text-white`}
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Link to="/history">📊 주행 기록</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:text-white focus:text-white`}
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Link to="/emulator">⚒️ 에뮬레이터</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} bg-transparent text-white hover:text-white focus:text-white`}
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'var(--main-gradient-hover)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Link to="/detail">🔧 차량 관리</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default MenuBox;
