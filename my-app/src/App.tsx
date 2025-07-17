// 이 파일은 Vite 구조에 맞게 App.tsx로 이름이 변경될 예정입니다.
import React from "react";
import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import TopBar from '../components/TopBar/TopBar';
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div>
      <div>
      <TopBar title="관제 시스템 메인 화면" />
      <Button></Button>
      </div>
    </div>
  );
}

export default App;
