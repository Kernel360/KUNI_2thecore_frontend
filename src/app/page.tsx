import Link from 'next/link';
import TopBar from '@/components/ui/topBar';
import UserBox from '@/components/userBox/userBox';
import StatusContainer from '@/components/statusBox/statusContainer';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/appSideBar"

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopBar title="차량 관제 시스템"></TopBar>
      <UserBox />
      <StatusContainer />
      <div style={{
        display: 'flex', justifyContent: 'center', width: '100%', gap: '35px', marginTop: '20px'
      }}>
      </div>
        <AppSidebar></AppSidebar>
      

    </div>
  );
}
