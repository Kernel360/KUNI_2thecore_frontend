'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { analysisApi } from '@/lib/api';

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

export function AnalysisPage() {
  // 각 탭별 데이터 상태
  const [periodData, setPeriodData] = useState<PeriodAnalysisData | null>(null);
  const [trendData, setTrendData] = useState<TrendAnalysisData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastAnalysisData | null>(null);
  const [clusterData, setClusterData] = useState<ClusterAnalysisData | null>(null);
  
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

  const renderVisualization = (key: keyof typeof visualizationTitles, base64Data?: string) => {
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
              src={`data:image/png;base64,${base64Data}`}
              alt={visualizationTitles[key]}
              className="max-w-full h-auto rounded-lg shadow-sm"
              onError={(e) => {
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
    data: PeriodAnalysisData | TrendAnalysisData | ForecastAnalysisData | ClusterAnalysisData | null,
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

    const visualizations = Object.entries(data.visualizations).filter(([, value]) => value);

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
                  onChange={(e) => setPeriodParams(prev => ({ ...prev, year: e.target.value }))}
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
                {loading.period ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                  onChange={(e) => setTrendParams(prev => ({ ...prev, start_year: parseInt(e.target.value) }))}
                  className="w-24"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">종료 연도:</label>
                <Input
                  type="number"
                  value={trendParams.end_year}
                  onChange={(e) => setTrendParams(prev => ({ ...prev, end_year: parseInt(e.target.value) }))}
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
                  onChange={(e) => setTrendParams(prev => ({ ...prev, top_n: parseInt(e.target.value) }))}
                  className="w-20"
                />
              </div>
              <Button onClick={fetchTrendAnalysis} disabled={loading.trend}>
                {loading.trend ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                  onChange={(e) => setForecastParams(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-36"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">종료일:</label>
                <Input
                  type="date"
                  value={forecastParams.end_date}
                  onChange={(e) => setForecastParams(prev => ({ ...prev, end_date: e.target.value }))}
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
                  onChange={(e) => setForecastParams(prev => ({ ...prev, forecast_days: parseInt(e.target.value) }))}
                  className="w-20"
                />
              </div>
              <Button onClick={fetchForecastAnalysis} disabled={loading.forecast}>
                {loading.forecast ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                분석 실행
              </Button>
            </div>
            {renderTabContent(forecastData, loading.forecast, fetchForecastAnalysis)}
          </TabsContent>

          {/* 1.4 지역별 클러스터링 분석 */}
          <TabsContent value="cluster" className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">시작일:</label>
                <Input
                  type="date"
                  value={clusterParams.start_date}
                  onChange={(e) => setClusterParams(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-36"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">종료일:</label>
                <Input
                  type="date"
                  value={clusterParams.end_date}
                  onChange={(e) => setClusterParams(prev => ({ ...prev, end_date: e.target.value }))}
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
                  onChange={(e) => setClusterParams(prev => ({ ...prev, k: parseInt(e.target.value) }))}
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
                {loading.cluster ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                분석 실행
              </Button>
            </div>
            {renderTabContent(clusterData, loading.cluster, fetchClusterAnalysis)}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
