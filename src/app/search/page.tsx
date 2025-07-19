import React from 'react'
import Link from 'next/link'

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">차량 검색</h1>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            메인으로 돌아가기
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">검색 조건</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        차량 번호
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="차량 번호를 입력하세요"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        차량 종류
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">전체</option>
                                        <option value="truck">트럭</option>
                                        <option value="bus">버스</option>
                                        <option value="car">승용차</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        상태
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">전체</option>
                                        <option value="operating">운행 중</option>
                                        <option value="waiting">대기 중</option>
                                        <option value="repair">수리 중</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    검색
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">검색 결과</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 border-b text-left">차량 번호</th>
                                            <th className="px-4 py-2 border-b text-left">차량 종류</th>
                                            <th className="px-4 py-2 border-b text-left">상태</th>
                                            <th className="px-4 py-2 border-b text-left">운전자</th>
                                            <th className="px-4 py-2 border-b text-left">위치</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b">12가3456</td>
                                            <td className="px-4 py-2 border-b">트럭</td>
                                            <td className="px-4 py-2 border-b">
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                    운행 중
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border-b">김철수</td>
                                            <td className="px-4 py-2 border-b">서울시 강남구</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b">34나5678</td>
                                            <td className="px-4 py-2 border-b">버스</td>
                                            <td className="px-4 py-2 border-b">
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                                    대기 중
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border-b">이영희</td>
                                            <td className="px-4 py-2 border-b">서울시 서초구</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border-b">56다7890</td>
                                            <td className="px-4 py-2 border-b">승용차</td>
                                            <td className="px-4 py-2 border-b">
                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                                    수리 중
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border-b">박민수</td>
                                            <td className="px-4 py-2 border-b">서울시 마포구</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 