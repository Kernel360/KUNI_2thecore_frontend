import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <span className="text-xl font-bold">theCore</span>
              </div>
              <nav className="flex gap-6">
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                  🏠 홈
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                  🚗 차량 검색
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                  📍 주행 기록
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg border-b-2 border-blue-600">
                  📊 데이터 분석
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                  ⚙️ 애플리케이터
                </button>
              </nav>
            </div>
            <div className="text-sm text-gray-600">1234 님</div>
          </div>
        </div>
      </header>
}