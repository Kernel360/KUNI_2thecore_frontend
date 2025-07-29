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

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[1250px] max-w-sm h-[400px] flex flex-col">
        {/* Card의 각 섹션 사이에 gap을 주고 싶으면 여기에 gap 추가 */}
        <div className="flex flex-col h-full gap-12 flex-1">
          <CardHeader className="flex flex-col gap-4">
            <CardTitle className="flex flex-col gap-4">로그인</CardTitle>
            <CardDescription  className="flex flex-col gap-4">아이디와 비밀번호를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">비밀번호</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full flex flex-col gap-4">
              로그인
            </Button>
            <p  className="flex flex-col gap-4">
              새 계정을 등록하고 싶으신 분은 ooo@oooo.com으로 문의주시길 바랍니다.
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
