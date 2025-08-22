import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function AnalysisPage() {
  // 샘플 데이터
  const monthlyVehicleData = [
    { month: '1월', sedan: 45, suv: 32, truck: 23 },
    { month: '2월', sedan: 52, suv: 38, truck: 28 },
    { month: '3월', sedan: 48, suv: 42, truck: 31 },
    { month: '4월', sedan: 61, suv: 45, truck: 34 },
    { month: '5월', sedan: 55, suv: 48, truck: 37 },
    { month: '6월', sedan: 67, suv: 52, truck: 41 },
  ];

  const trendData = [
    { date: '1주', electric: 12, hybrid: 25, gasoline: 63 },
    { date: '2주', electric: 15, hybrid: 28, gasoline: 57 },
    { date: '3주', electric: 18, hybrid: 32, gasoline: 50 },
    { date: '4주', electric: 22, hybrid: 35, gasoline: 43 },
  ];

  const dailyPredictionData = [
    { day: '월', actual: 156, predicted: 162 },
    { day: '화', actual: 142, predicted: 138 },
    { day: '수', actual: 178, predicted: 175 },
    { day: '목', actual: 165, predicted: 168 },
    { day: '금', actual: 189, predicted: 185 },
    { day: '토', actual: 134, predicted: 140 },
    { day: '일', actual: 98, predicted: 102 },
  ];

  const regionData = [
    { name: '강남구', value: 35, color: '#3b82f6' },
    { name: '서초구', value: 28, color: '#10b981' },
    { name: '송파구', value: 22, color: '#f59e0b' },
    { name: '영등포구', value: 15, color: '#ef4444' },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">데이터 분석</h1>
        <p className="text-gray-600">
          차량 운행 데이터를 다양한 관점에서 분석해보세요
        </p>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="monthly" className="text-sm">
            월별 선호차량
          </TabsTrigger>
          <TabsTrigger value="trend" className="text-sm">
            선호 차량 트렌드
          </TabsTrigger>
          <TabsTrigger value="prediction" className="text-sm">
            일별 운행차량 수 예측
          </TabsTrigger>
          <TabsTrigger value="regional" className="text-sm">
            지역별 중요도
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>월별 선호 차량 유형</CardTitle>
              <CardDescription>
                최근 6개월간 차량 유형별 선호도 변화를 확인할 수 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyVehicleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sedan" fill="#3b82f6" name="세단" />
                    <Bar dataKey="suv" fill="#10b981" name="SUV" />
                    <Bar dataKey="truck" fill="#f59e0b" name="트럭" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  세단 평균 55대
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  SUV 평균 43대
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700"
                >
                  트럭 평균 32대
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>선호 차량 트렌드</CardTitle>
              <CardDescription>
                연료 유형별 선호도 변화 추이를 분석합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="electric"
                      stroke="#10b981"
                      name="전기차"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="hybrid"
                      stroke="#f59e0b"
                      name="하이브리드"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="gasoline"
                      stroke="#ef4444"
                      name="가솔린"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+83%</div>
                  <div className="text-sm text-green-700">전기차 증가율</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">+40%</div>
                  <div className="text-sm text-yellow-700">
                    하이브리드 증가율
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">-32%</div>
                  <div className="text-sm text-red-700">가솔린 감소율</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>일별 운행차량 수 예측</CardTitle>
              <CardDescription>
                AI 모델을 통한 일별 운행차량 수 예측과 실제 데이터 비교
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyPredictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="actual" fill="#3b82f6" name="실제" />
                    <Bar dataKey="predicted" fill="#94a3b8" name="예측" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-900">
                    예측 정확도
                  </div>
                  <div className="text-3xl font-bold text-blue-600">94.2%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    평균 오차
                  </div>
                  <div className="text-3xl font-bold text-gray-600">±4.8대</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>지역별 중요도</CardTitle>
              <CardDescription>
                운행 빈도와 수익성을 기반으로 한 지역별 중요도 분석
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {regionData.map((region, index) => (
                    <div
                      key={region.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: region.color }}
                        />
                        <span className="font-medium">{region.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{region.value}%</div>
                        <div className="text-sm text-gray-500">
                          {index === 0
                            ? '최고 중요도'
                            : index === 1
                              ? '높은 중요도'
                              : index === 2
                                ? '보통 중요도'
                                : '낮은 중요도'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
