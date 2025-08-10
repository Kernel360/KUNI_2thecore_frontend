import { mainApi, ApiResponse } from '@/lib/api';

// 차량 통계 데이터 타입
export interface CarStatistics {
  total: number;
  driving: number;
  idle: number;
  maintenance: number;
}

export class StatisticsService {
  // 차량 통계 조회
  static async getCarStatistics(): Promise<CarStatistics> {
    const response = await mainApi.get<ApiResponse<CarStatistics>>(
      '/cars/statistics'
    );
    return response.data.data;
  }
}
