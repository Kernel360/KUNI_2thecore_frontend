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
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth-service';
import { TokenManager } from '@/lib/token-manager';

/**
 * 로그아웃 처리 함수
 * - AuthService를 통해 서버에 로그아웃 API 호출
 * - TokenManager를 통한 로컬 토큰 정리
 * - 로그인 페이지로 리다이렉트
 */
const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // AuthService를 통해 로그아웃 API 호출 및 토큰 정리
      await AuthService.logout();
      
      // 로그인 페이지로 리다이렉트
      navigate('/login');
    } catch (error) {
      // 에러가 발생해도 로그인 페이지로 이동 (토큰은 이미 정리됨)
      console.error('로그아웃 처리 중 오류:', error);
      navigate('/login');
    }
  };

  return handleLogout;
};

export function AccountDropdown() {
  const handleLogout = useLogout();
  const loginId = TokenManager.getLoginId();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={styles.Button}>👤 {loginId} 님</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-56 ${styles.AccountDropdown}`}
        align="start"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>마이페이지</DropdownMenuItem>
        <DropdownMenuItem>알림</DropdownMenuItem>
        <DropdownMenuItem>설정</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={styles.logout} onClick={handleLogout}>
          🔓 로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const UserBox = () => {
  return <AccountDropdown />;
};
export default UserBox;
