import React from 'react';
import { Map, Car, BarChart3, Wrench } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar';

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <div className="bg-gray-200 p-4 h-full">
                    <div className="space-y-3 mt-20">
                        {/* 지도 - 활성화된 상태 */}
                        <SidebarMenuButton
                            isActive={true}
                            className="w-full bg-gray-300 rounded-lg shadow-sm p-4 flex items-center space-x-3 hover:shadow-md transition-shadow"
                        >
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                <Map className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-gray-800 font-medium">지도</span>
                        </SidebarMenuButton>

                        {/* 차량 검색 */}
                        <SidebarMenuButton
                            className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 hover:shadow-md transition-shadow"
                        >
                            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-gray-800 font-medium">차량 검색</span>
                        </SidebarMenuButton>

                        {/* 주행 기록 및 경로 */}
                        <SidebarMenuButton
                            className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 hover:shadow-md transition-shadow"
                        >
                            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-gray-800 font-medium">주행 기록 및 경로</span>
                        </SidebarMenuButton>

                        {/* 차량 관리 */}
                        <SidebarMenuButton
                            className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 hover:shadow-md transition-shadow"
                        >
                            <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-gray-800 font-medium">차량 관리</span>
                        </SidebarMenuButton>
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}