
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analysisApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// 공통 응답 인터페이스
interface BaseAnalysisResponse {
  success: boolean;
  message: string;
}

// 1.1 월별/계절별 선호도 분석
interface PeriodAnalysisData extends BaseAnalysisResponse {
  visualizations: {
    brand_period_heatmap?: string;
    market_share_pie?: string;
    brand_preference_line?: string;
    seasonality_radar?: string;
    seasonality_strength_bar?: string;
    statistical_comparison?: string;
  };
}

// 1.2 연도별 트렌드 분석
interface TrendAnalysisData extends BaseAnalysisResponse {
  visualizations: {
    brand_trend_lines?: string;
    model_ranking_change?: string;
    car_age_preference?: string;
    market_share_evolution?: string;
    trend_summary?: string;
  };
}

// 1.3 일별 운행차량 수 예측
interface ForecastAnalysisData extends BaseAnalysisResponse {
  visualizations: {
    usage_trend_with_prediction?: string;
    weekday_pattern?: string;
  };
  historical_data?: Array<{
    date: string;
    unique_cars: number;
    total_trips: number;
    total_distance: number;
  }>;
  predictions?: Array<{
    date: string;
    predicted_unique_cars: number;
  }>;
  weekday_patterns?: Record<string, number>;
  model_accuracy?: {
    r2: number;
    mae: number;
  };
}

// 1.4 지역별 클러스터링 분석
interface ClusterAnalysisData extends BaseAnalysisResponse {
  visualizations: {
    cluster_map?: string;
    recommendation_map?: string;
  };
  cluster_summary?: Array<{
    cluster_id: number;
    trip_count: number;
    unique_cars: number;
    avg_distance: number;
    total_distance: number;
    center_lat: number;
    center_lng: number;
    importance_score: number;
  }>;
}

// 모든 시각화 제목과 설명
const visualizationTitles = {
  // 1.1 월별/계절별 선호도 분석
  brand_period_heatmap: '브랜드별 기간 히트맵',
  market_share_pie: '시장 점유율',
  brand_preference_line: '브랜드 선호도 추이',
  seasonality_radar: '계절성 분석',
  seasonality_strength_bar: '계절성 강도',
  statistical_comparison: '통계 비교',

  // 1.2 연도별 트렌드 분석
  brand_trend_lines: '브랜드별 트렌드',
  model_ranking_change: '모델 순위 변화',
  car_age_preference: '차량 연식별 선호도',
  market_share_evolution: '시장 점유율 진화',
  trend_summary: '트렌드 요약',

  // 1.3 일별 운행차량 수 예측
  usage_trend_with_prediction: '운행 추세 및 예측',
  weekday_pattern: '요일별 패턴',

  // 1.4 지역별 클러스터링 분석
  cluster_map: '클러스터 지도',
  recommendation_map: '추천 지역 지도',
};

const visualizationDescriptions = {
  // 1.1 월별/계절별 선호도 분석
  brand_period_heatmap: '각 브랜드의 기간별 선호도를 히트맵으로 표현',
  market_share_pie: '렌트카 브랜드별 시장 점유율 현황',
  brand_preference_line: '시간에 따른 브랜드 선호도 변화 추이',
  seasonality_radar: '계절별 브랜드 선호도 패턴 분석',
  seasonality_strength_bar: '브랜드별 계절성 영향력 정도',
  statistical_comparison: '브랜드간 통계적 비교 분석',

  // 1.2 연도별 트렌드 분석
  brand_trend_lines: '연도별 브랜드 시장 점유율 트렌드',
  model_ranking_change: '상위 모델들의 트렌드 변화',
  car_age_preference: '차량 연식별 선호도 트렌드',
  market_share_evolution: '브랜드별 변동성 및 성장률',
  trend_summary: '브랜드별 트렌드 종합 분석',

  // 1.3 일별 운행차량 수 예측
  usage_trend_with_prediction: '과거 데이터와 미래 예측 트렌드',
  weekday_pattern: '요일별 운행 차량 수 패턴',

  // 1.4 지역별 클러스터링 분석
  cluster_map: '수요 집중 지역 클러스터링 결과',
  recommendation_map: '신규 영업소 추천 위치',
};

export default function AnalysisPage() {
  // 각 탭별 데이터 상태
  const [periodData, setPeriodData] = useState<PeriodAnalysisData | null>(null);
  const [trendData, setTrendData] = useState<TrendAnalysisData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastAnalysisData | null>(
    null
  );
  const [clusterData, setClusterData] = useState<ClusterAnalysisData | null>(
    null
  );

  // 각 탭별 로딩 상태
  const [loading, setLoading] = useState({
    period: false,
    trend: false,
    forecast: false,
    cluster: false,
  });

  // 1.1 월별/계절별 선호도 분석 파라미터
  const [periodParams, setPeriodParams] = useState({
    year: '2024',
    period_type: 'month' as 'month' | 'season',
  });

  // 1.2 연도별 트렌드 분석 파라미터
  const [trendParams, setTrendParams] = useState({
    start_year: 2020,
    end_year: 2024,
    top_n: 5,
  });

  // 1.3 일별 예측 분석 파라미터
  const [forecastParams, setForecastParams] = useState({
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    forecast_days: 7,
  });

  // 1.4 클러스터링 분석 파라미터
  const [clusterParams, setClusterParams] = useState({
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    k: 5,
    method: 'kmeans' as 'kmeans' | 'dbscan',
  });

  // 1.1 월별/계절별 선호도 분석
  const fetchPeriodAnalysis = async () => {
    setLoading(prev => ({ ...prev, period: true }));
    try {
      const response = await analysisApi.get('/analysis/period', {
        params: periodParams,
      });
      setPeriodData(response.data);
    } catch (error) {
      console.error('월별/계절별 분석 실패:', error);
      setPeriodData({
        success: false,
        message: error instanceof Error ? error.message : '분석 실패',
        visualizations: {},
      });
    } finally {
      setLoading(prev => ({ ...prev, period: false }));
    }
  };

  // 1.2 연도별 트렌드 분석
  const fetchTrendAnalysis = async () => {
    setLoading(prev => ({ ...prev, trend: true }));
    try {
      const response = await analysisApi.get('/analysis/trend', {
        params: trendParams,
      });
      setTrendData(response.data);
    } catch (error) {
      console.error('연도별 트렌드 분석 실패:', error);
      setTrendData({
        success: false,
        message: error instanceof Error ? error.message : '분석 실패',
        visualizations: {},
      });
    } finally {
      setLoading(prev => ({ ...prev, trend: false }));
    }
  };

  // 1.3 일별 운행차량 수 예측
  const fetchForecastAnalysis = async () => {
    setLoading(prev => ({ ...prev, forecast: true }));
    try {
      const response = await analysisApi.get('/forecast/daily', {
        params: forecastParams,
      });
      setForecastData(response.data);
    } catch (error) {
      console.error('일별 예측 분석 실패:', error);
      setForecastData({
        success: false,
        message: error instanceof Error ? error.message : '분석 실패',
        visualizations: {},
      });
    } finally {
      setLoading(prev => ({ ...prev, forecast: false }));
    }
  };

  // 1.4 지역별 클러스터링 분석
  const fetchClusterAnalysis = async () => {
    setLoading(prev => ({ ...prev, cluster: true }));
    try {
      const response = await analysisApi.get('/clustering/regions', {
        params: clusterParams,
      });
      setClusterData(response.data);
    } catch (error) {
      console.error('클러스터링 분석 실패:', error);
      setClusterData({
        success: false,
        message: error instanceof Error ? error.message : '분석 실패',
        visualizations: {},
      });
    } finally {
      setLoading(prev => ({ ...prev, cluster: false }));
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 첫 번째 탭 데이터 로드
    fetchPeriodAnalysis();
  }, []);

  const renderVisualization = (
    key: keyof typeof visualizationTitles,
    base64Data?: string
  ) => {
    if (!base64Data) return null;

    return (
      <Card key={key} className="overflow-hidden">
        <CardHeader>
          <CardTitle>{visualizationTitles[key]}</CardTitle>
          <CardDescription>{visualizationDescriptions[key]}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex justify-center">
            <img
              src={base64Data}
              alt={visualizationTitles[key]}
              className="max-w-full h-auto rounded-lg shadow-sm"
              onError={e => {
                e.currentTarget.src = '/placeholder-chart.png';
                e.currentTarget.alt = '차트를 불러올 수 없습니다';
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTabContent = (
    data:
      | PeriodAnalysisData
      | TrendAnalysisData
      | ForecastAnalysisData
      | ClusterAnalysisData
      | null,
    isLoading: boolean,
    onRetry: () => void
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">분석 데이터를 불러오는 중...</span>
        </div>
      );
    }

    if (!data || !data.success) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {data?.message || '분석 데이터를 불러올 수 없습니다.'}
          </p>
          <Button onClick={onRetry}>다시 시도</Button>
        </div>
      );
    }

    const visualizations = Object.entries(data.visualizations).filter(
      ([, value]) => value
    );

    if (visualizations.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">표시할 분석 데이터가 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visualizations.map(([key, value]) =>
          renderVisualization(key as keyof typeof visualizationTitles, value)
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">데이터 분석</h1>
          <p className="text-gray-600">
            렌트카 운행 데이터를 다양한 관점에서 분석해보세요
          </p>
        </div>

        <Tabs defaultValue="period" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="period" className="text-sm">
              월별/계절별 선호도
            </TabsTrigger>
            <TabsTrigger value="trend" className="text-sm">
              연도별 트렌드
            </TabsTrigger>
            <TabsTrigger value="forecast" className="text-sm">
              운행량 예측
            </TabsTrigger>
            <TabsTrigger value="cluster" className="text-sm">
              지역별 클러스터링
            </TabsTrigger>
          </TabsList>

          {/* 1.1 월별/계절별 선호도 분석 */}
          <TabsContent value="period" className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">연도:</label>
                <Input
                  type="text"
                  value={periodParams.year}
                  onChange={e =>
                    setPeriodParams(prev => ({ ...prev, year: e.target.value }))
                  }
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">분석 유형:</label>
                <Select
                  value={periodParams.period_type}
                  onValueChange={(value: 'month' | 'season') =>
                    setPeriodParams(prev => ({ ...prev, period_type: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">월별</SelectItem>
                    <SelectItem value="season">계절별</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={fetchPeriodAnalysis} disabled={loading.period}>
                {loading.period ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                분석 실행
              </Button>
            </div>
            {renderTabContent(periodData, loading.period, fetchPeriodAnalysis)}
          </TabsContent>

          {/* 1.2 연도별 트렌드 분석 */}
          <TabsContent value="trend" className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">시작 연도:</label>
                <Input
                  type="number"
                  value={trendParams.start_year}
                  onChange={e =>
                    setTrendParams(prev => ({
                      ...prev,
                      start_year: parseInt(e.target.value),
                    }))
                  }
                  className="w-24"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">종료 연도:</label>
                <Input
                  type="number"
                  value={trendParams.end_year}
                  onChange={e =>
                    setTrendParams(prev => ({
                      ...prev,
                      end_year: parseInt(e.target.value),
                    }))
                  }
                  className="w-24"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">상위 N개:</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={trendParams.top_n}
                  onChange={e =>
                    setTrendParams(prev => ({
                      ...prev,
                      top_n: parseInt(e.target.value),
                    }))
                  }
                  className="w-20"
                />
              </div>
              <Button onClick={fetchTrendAnalysis} disabled={loading.trend}>
                {loading.trend ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                분석 실행
              </Button>
            </div>
            {renderTabContent(trendData, loading.trend, fetchTrendAnalysis)}
          </TabsContent>

          {/* 1.3 일별 운행차량 수 예측 */}
          <TabsContent value="forecast" className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">시작일:</label>
                <Input
                  type="date"
                  value={forecastParams.start_date}
                  onChange={e =>
                    setForecastParams(prev => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                  className="w-36"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">종료일:</label>
                <Input
                  type="date"
                  value={forecastParams.end_date}
                  onChange={e =>
                    setForecastParams(prev => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }
                  className="w-36"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">예측 일수:</label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={forecastParams.forecast_days}
                  onChange={e =>
                    setForecastParams(prev => ({
                      ...prev,
                      forecast_days: parseInt(e.target.value),
                    }))
                  }
                  className="w-20"
                />
              </div>
              <Button
                onClick={fetchForecastAnalysis}
                disabled={loading.forecast}
              >
                {loading.forecast ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                분석 실행
              </Button>
            </div>
            {renderTabContent(
              forecastData,
              loading.forecast,
              fetchForecastAnalysis
            )}
          </TabsContent>

          {/* 1.4 지역별 클러스터링 분석 */}
          <TabsContent value="cluster" className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">시작일:</label>
                <Input
                  type="date"
                  value={clusterParams.start_date}
                  onChange={e =>
                    setClusterParams(prev => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                  className="w-36"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">종료일:</label>
                <Input
                  type="date"
                  value={clusterParams.end_date}
                  onChange={e =>
                    setClusterParams(prev => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }
                  className="w-36"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">클러스터 수:</label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={clusterParams.k}
                  onChange={e =>
                    setClusterParams(prev => ({
                      ...prev,
                      k: parseInt(e.target.value),
                    }))
                  }
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">방법:</label>
                <Select
                  value={clusterParams.method}
                  onValueChange={(value: 'kmeans' | 'dbscan') =>
                    setClusterParams(prev => ({ ...prev, method: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kmeans">K-Means</SelectItem>
                    <SelectItem value="dbscan">DBSCAN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={fetchClusterAnalysis} disabled={loading.cluster}>
                {loading.cluster ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                분석 실행
              </Button>
            </div>
            {renderTabContent(
              clusterData,
              loading.cluster,
              fetchClusterAnalysis
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
=======
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
