import styles from '@/components/menu-box/menu-box.module.css';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Link, useLocation } from 'react-router-dom';
import { AccountDropdown } from '../user-box';

const MenuBox = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getItemStyle = (path: string) => {
    const isCurrentPage = isActive(path);
    return {
      transition: 'all 0.3s ease',
      background: isCurrentPage ? '#3a70ff' : 'transparent',
      color: isCurrentPage ? 'white' : '#1e293b',
    };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>, path: string) => {
    if (!isActive(path)) {
      e.currentTarget.style.background = '#3a70ff';
      e.currentTarget.style.color = 'white';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>, path: string) => {
    const isCurrentPage = isActive(path);
    e.currentTarget.style.background = isCurrentPage
      ? '#3a70ff'
      : 'transparent';
    e.currentTarget.style.color = isCurrentPage ? 'white' : '#1e293b';
  };

  return (
    <div className={styles.menuAccountFlex}>
      <NavigationMenu className="max-w-full justify-start px-4 py-2">
        <NavigationMenuList className="gap-6">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} hover:text-white focus:text-white`}
              style={getItemStyle('/')}
              onMouseEnter={e => handleMouseEnter(e, '/')}
              onMouseLeave={e => handleMouseLeave(e, '/')}
            >
              <Link to="/">🏠 홈</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} hover:text-white focus:text-white`}
              style={getItemStyle('/search')}
              onMouseEnter={e => handleMouseEnter(e, '/search')}
              onMouseLeave={e => handleMouseLeave(e, '/search')}
            >
              <Link to="/search">🚗 차량 검색</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} hover:text-white focus:text-white`}
              style={getItemStyle('/history')}
              onMouseEnter={e => handleMouseEnter(e, '/history')}
              onMouseLeave={e => handleMouseLeave(e, '/history')}
            >
              <Link to="/history">📝 주행 기록</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} hover:text-white focus:text-white`}
              style={getItemStyle('/analysis')}
              onMouseEnter={e => handleMouseEnter(e, '/analysis')}
              onMouseLeave={e => handleMouseLeave(e, '/analysis')}
            >
              <Link to="/analysis">📊 데이터 분석</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={`${navigationMenuTriggerStyle()} hover:text-white focus:text-white`}
              style={getItemStyle('/emulator')}
              onMouseEnter={e => handleMouseEnter(e, '/emulator')}
              onMouseLeave={e => handleMouseLeave(e, '/emulator')}
            >
              <Link to="/emulator">⚙️ 에뮬레이터</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <AccountDropdown />
    </div>
  );
};

export default MenuBox;
