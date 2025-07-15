import React from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Typography from '@mui/material/Typography';
import TopBar from '../components/TopBar/TopBar';

export default function Home() {
  return (
    <div>
      <div>
      <TopBar title="관제 시스템 메인 화면" />
      </div>
    </div>
  );
}
