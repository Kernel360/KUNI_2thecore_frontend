import styles from '@/components/menu-box/menu-box.module.css';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AccountDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={styles.Button}>👤 관리자 님</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-56 ${styles.AccountDropdown}`}
        align="start"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={styles.logout}>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const UserBox = () => {
  return <AccountDropdown />;
};
export default UserBox;
