import React from "react";
import TopBar from '../components/TopBar/TopBar';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div>
      <TopBar title="관제 시스템 메인 화면" />
      <Button>안녕하세요</Button>
      </div>
    </div>
  );
}
