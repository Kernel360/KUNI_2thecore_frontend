import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
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
      <Card
        className="flex flex-col"
        style={{
          width: '500px',
          height: '300px',
          justifyContent: 'center',
          alignContent: 'center',
          margin: '10%',
          padding: '20px 40px 20px 40px',
          backgroundColor: 'white',
        }}
      >
        <div className="flex flex-col h-full justify-around">
          <CardHeader className="flex-shrink-0">
            <div className="flex justify-between items-start mb-1">
              <div>
                <CardTitle>로그인</CardTitle>
                <CardDescription>
                  아이디와 비밀번호를 입력하세요.
                </CardDescription>
              </div>
              <CardAction>
                <Button type="button" variant="link">
                  회원가입
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="loginId">아이디</Label>
                <Input id="loginId" type="text" required />
              </div>
              <div className="flex flex-col mb-1">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p>새 계정을 등록하려면 ooo@oooo.com으로 문의주시길 바랍니다.</p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
