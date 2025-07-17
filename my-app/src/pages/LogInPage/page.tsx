import React from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function Login() {
  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>아이디와 비밀번호를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="아이디 입력" />
            <Input type="password" placeholder="비밀번호 입력" />
            <Button>로그인</Button>
          </CardContent>
          <CardFooter>
            <p>새 계정을 등록하고 싶으신 분은 ooo@oooo.com으로 문의주시길 바랍니다.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
