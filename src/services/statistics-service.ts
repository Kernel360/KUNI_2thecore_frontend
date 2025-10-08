import { ApiResponse, mainApi } from '@/lib/api';

// 차량 통계 데이터 타입
export interface CarStatistics {
  total: number;
  driving: number;
  idle: number;
  maintenance: number;
}

// 대시보드 랭킹 데이터 타입
export interface DashboardRanking {
  topCarModel: {
    model1: string;
    model2: string;
    model3: string;
  };
  topRegion: {
    region1: string;
    region2: string;
    region3: string;
  };
  topCarType: {
    type1: string;
    type2: string;
    type3: string;
  };
}

export class StatisticsService {
  // 차량 통계 조회
  static async getCarStatistics(): Promise<CarStatistics> {
    const response =
      await mainApi.get<ApiResponse<CarStatistics>>('/cars/statistics');
    return response.data.data;
  }

  // 대시보드 랭킹 데이터 조회
  static async getDashboardRanking(): Promise<DashboardRanking> {
    const response =
      await mainApi.get<ApiResponse<DashboardRanking>>('/dashboard');
    return response.data.data;
  }
}
