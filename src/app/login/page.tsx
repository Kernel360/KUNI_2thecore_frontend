import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TopBar from '@/components/ui/topBar';
import { AuthService } from '@/services/auth-service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  localStorage.setItem('loginId', 'dev');
  localStorage.setItem(
    'accessToken',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZXYiLCJsb2dpbklkIjoiZGV2IiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTc1NTMyODg1MSwiZXhwIjoxNzU1MzI5NDUxfQ.ehnzwZvMmDzjNL399ZAI6PnbCqsnOV0nKa_CKc9a3w8'
  );
  const [credentials, setCredentials] = useState({
    loginId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.loginId || !credentials.password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await AuthService.login(credentials);
      navigate('/');
    } catch (error: any) {
      setError(error.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <TopBar title="로그인"></TopBar>
      <div
        className="w-[98%] h-px border-b-2"
        style={{ borderBottomColor: '#3a70ff' }}
      />
      <Card className="w-full max-w-md mt-20">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>아이디와 비밀번호를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <Label htmlFor="loginId">아이디</Label>
              <Input
                id="loginId"
                name="loginId"
                type="text"
                value={credentials.loginId}
                onChange={handleChange}
                required
              />
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-lg hover:shadow-blue-800/40 active:scale-95"
                disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <p>새 계정 등록 문의: ooo@oooo.com</p>
        </CardFooter>
      </Card>
    </div>
  );
}
