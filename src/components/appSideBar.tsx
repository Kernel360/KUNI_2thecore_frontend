import React from 'react';
import { Map, Car, ChartArea, Pencil } from 'lucide-react';

export function AppSidebar() {
    return (
        <aside className="w-64 h-screen bg-white dark:bg-[#000000] shadow-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white"></h1>
            </div>
            <nav className="mt-4">
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 dark:bg-[#1E2028] dark:text-gray-200">
                    <Map className="w-5 h-5 mr-2" />
                    지도
                </a>
                <a href="#" className="flex items-center px-4 py-2 mt-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-[#1E2028] dark:text-gray-400">
                    <Car className="w-5 h-5 mr-2" />
                    차량 검색
                </a>
                <a href="#" className="flex items-center px-4 py-2 mt-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-[#1E2028] dark:text-gray-400">
                    <ChartArea className="w-5 h-5 mr-2" />
                    Messages
                </a>
                <a href="#" className="flex items-center px-4 py-2 mt-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-[#1E2028] dark:text-gray-400">
                    <Pencil className="w-5 h-5 mr-2" />
                    차량 관리
                </a>
            </nav>
        </aside>
    );
}