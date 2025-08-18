import { TokenManager } from '@/lib/token-manager';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // 1. 토큰이 없으면 바로 로그인 페이지로
      if (!TokenManager.hasValidTokens()) {
        navigate('/login');
        return;
      }

      // 2. 토큰이 있으면 백엔드에 검증 요청
      try {
        const isValid = await TokenManager.hasValidTokens();
        if (isValid) {
          // 토큰 유효하면 로딩 완료
          setLoading(false);
        } else {
          // 토큰 무효하면 로그인 페이지로
          //TokenManager.clearTokens();
          navigate('/login');
        }
      } catch (error) {
        // 검증 실패하면 로그인 페이지로
        //TokenManager.clearTokens();
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // 로딩 중이면 로딩 화면 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  return <>{children}</>;
}
