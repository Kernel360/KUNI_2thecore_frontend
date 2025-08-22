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

  const getMenuItemClass = (path: string) => {
    const isCurrentPage = isActive(path);
    return `${navigationMenuTriggerStyle()} ${styles.menuItem} ${styles.menuItemHover} ${
      isCurrentPage ? styles.menuItemActive : ''
    }`;
  };

  return (
    <div className={styles.menuAccountFlex}>
      <NavigationMenu className="max-w-full justify-start px-4 py-2">
        <NavigationMenuList className="gap-3">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={getMenuItemClass('/search')}
            >
              <Link to="/search">🚗 차량 검색</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={getMenuItemClass('/history')}
            >
              <Link to="/history">📝 주행 기록</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={getMenuItemClass('/analysis')}
            >
              <Link to="/analysis">📊 데이터 분석</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={getMenuItemClass('/emulator')}
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
