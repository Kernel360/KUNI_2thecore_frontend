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

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <TopBar title="로그인"></TopBar>
      <Card className="w-full max-w-md mt-20">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>아이디와 비밀번호를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-4">
              <Label htmlFor="loginId">아이디</Label>
              <Input id="loginId" type="text" required />
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" required />
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                로그인
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
